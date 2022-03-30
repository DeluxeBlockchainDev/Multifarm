import logging
import sys
import copy
import datetime


# user modules

# global config
from multifarm_api.config import config as cf
from multifarm_api.db_handles import db_handles as db_h
from multifarm_api.utils import utils as ut
from multifarm_api.hotfixes import hotfixes as hf

# local modules
from multifarm_api.inner_api_logic.update_locks import update_locks as u_locks
from multifarm_api.inner_api_logic.l_utils import l_utils as l_ut


class ScraperPushHandles:

    #############################
    # HELPERS                   #
    @staticmethod
    def fill_30d_history(old_entry, current_entry, hist_field, value_field, delta_days=0):
        """ should handle both tvlHistory 'farm' + tvLHistory & aprHistory 'asset'
            'hist_field' = field where 30d history is stored
            'value_field' = field of current value
        """
        current_simple_time = ut.get_utctime(simple=True, delta_days=delta_days)
        hist = old_entry.get(hist_field)

        # 1) check if there's no old history - if no, raise ValueError
        if not hist:
            print(f"no prev. '{hist_field}' historical field")
            logging.error(f"no prev. '{hist_field}' historical current value: {current_entry[value_field]}")
            # TODO: fix this bug later
            vs = old_entry[hist_field] = {"date": ut.get_utctime(simple=True, delta_days=1), "value": 0}
        else:
            # 2.1) unpack old 'vs' values
            vs = old_entry[hist_field][0]

        # # 2) process
        # else:
        # 2.1.1) unpack values
        vs_date = vs["date"]
        vs_value = vs["value"]

        # 2.2) only update if current_simple_time is higher than the old last one
        # 2.2.1) set 'is_set' variable for 3) = 24% functionality
        is_set = False
        if current_simple_time > vs_date:
            value = current_entry[value_field]
            try:
                float_value = float(value) if value else 0.0
                if float_value != 0.0:  # filter out 0.0(s)
                    # 2.3) loop over
                    # 2.3.1) setup variables for loop
                    now = ut.read_day_time(current_simple_time)
                    before = ut.read_day_time(vs_date)
                    delta = now - before
                    # 2.3.1.1) unpack days as normal var
                    delta_days = delta.days

                    # 2.3.2) prefill historicals with old value if there's a gap
                    if delta_days > 1:
                        change_per_day = (float_value - vs_value) / delta_days
                        fill_value = vs_value  # copy into new var
                        for i in range(1, delta_days):
                            fill_value += change_per_day
                            fill_date = before + datetime.timedelta(days=i)
                            fill_date_str = fill_date.strftime(cf.SIMPLE_DATE_FORMAT)
                            updated_entry = {'date': fill_date_str, 'value': round(fill_value, 2)}
                            hist.insert(0, updated_entry)

                    # 2.3.3) insert the current entry
                    updated_entry = {'date': current_simple_time, 'value': value}
                    hist.insert(0, updated_entry)

                    # 2.4) cut only last 30d
                    hist = hist[:30]

                    # 2.5) set value
                    current_entry[hist_field] = copy.deepcopy(hist)  # [NOTE:] Maybe Unnecessary.
                    is_set = True

            except ValueError:
                pass  # invalid value

            # 3) + 'tvlChange24h' for tvlStakedHistory-ONLY
            if hist_field == "tvlStakedHistory" and is_set:

                # 3.1) handle ValueError and 'n/a'
                try:
                    old_float = float(vs_value)
                    float_value = float(value)  # I know it's dumb; but I wanna re-crash into 'n/a' w/o getting further
                    current = round(float_value / old_float * 100, 2)
                except (ZeroDivisionError, ValueError):
                    current_entry["tvlChange24h"] = "n/a"
                    current_entry["tvlChange24hValue"] = 0.0
                    return

                # 3.2) adjust
                current = current - 100.0

                # 3.3) divide into per day, if it's actual
                if delta_days > 1:
                    current = current / delta.days

                # 3.4) round it up
                current_compo = round(current, 6)
                current = round(current, 2)

                # 3.5) add human-readable names
                if current == 0.0:
                    res = "0.0%"
                elif current > 0.0:
                    res = f"+{current}%"
                else:
                    res = f"{current}%"

                # 3.6) set
                current_entry["tvlChange24h"] = res
                current_entry["tvlChange24hValue"] = current_compo
                return

    @staticmethod
    def add_initial_30_d_historical_asset(asset_entry, delta_days):
        """ add 30d historical entry just for the first one, if we can
        """
        current_simple_time = ut.get_utctime(simple=True, delta_days=delta_days)
        for key, hist_field in [("aprYearly", "aprHistory"), ("tvlStaked", "tvlStakedHistory")]:
            value = asset_entry[key]
            try:
                float_value = float(value)
                if float_value or float_value == 0.0:  # 30th June, allow APR 0.0 for now
                    if hist_field in asset_entry:
                        if asset_entry[hist_field]:
                            continue

                    updated_entry = [{'date': current_simple_time, 'value': value}]
                    asset_entry[hist_field] = updated_entry

            except ValueError:
                pass  # invalid values

    #############################
    # CONSTRUCT ENTRIES         #
    @staticmethod
    def create_farm_insert_entry(farm_id, data, status, update=False, delta_days=0):
        """ creates an entry to 'add' or 'update' farms database with
        """
        # 1) resolve LFU
        should_update_LFU = cf.STATUSES_DICT[status]

        # 2) create and prefill base fields
        current_time = ut.get_utctime(delta_days=delta_days)
        current_simple_time = ut.get_utctime(simple=True, delta_days=delta_days)
        farm_entry_to_add = {
            "farmId": farm_id,
            "scam": data["scam"],
            "scamInfo": data["scamInfo"],
            "farmName": data["farmName"],
            "farmType": data["farmType"],
            "tvlStaked": data.get("tvlFarm") or data.get("tvlStaked"),
            "tvlStakedHistory": [{"date": current_simple_time, "value": data.get("tvlFarm") or data.get("tvlStaked")}],
            "tvlChange24h": "n/a",
            "tvlChange24hValue": 0.0,
            "blockchain": data["blockchain"],
            "active": data.get("active", True),  # temporary hack
            "dateAdded": data.get("dateAdded", current_time),
            "dateUpdated": data.get("dateUpdated", current_time),
            "lastFullUpdate": None
        }

        # 2.1) give time for lastFullUpdate only if relevant
        if should_update_LFU:
            farm_entry_to_add["lastFullUpdate"] = current_time

        # [hotfix] add append farms hotfix
        if "_entry_type" in data and not update:
            for field in ["tvlStakedHistory"]:
                if field in farm_entry_to_add:
                    del farm_entry_to_add[field]

            logging.warning("applied '_entry_type' delete fields logic")

        # 3) if update, remove dateAdded & LFU None
        if update:
            del farm_entry_to_add["tvlStakedHistory"]  # will get further down the code
            del farm_entry_to_add["dateAdded"]
            del farm_entry_to_add["tvlChange24h"]
            del farm_entry_to_add["tvlChange24hValue"]

            # & remove LFU = None to not rewrite old LFU
            if not should_update_LFU:
                del farm_entry_to_add["lastFullUpdate"]

        # # _) throw if 'tvlStakedHistory'
        # if 'tvlStakedHistory' in farm_entry_to_add:
        #     ut.save_json(data, "throw_data")
        #     ut.save_json(farm_entry_to_add, "throw_farm_entry_to_add")
        #     raise ValueError('tvlStakedHistory Error')

        # 4) return the entry
        return farm_entry_to_add

    # # # # # # # # # # # # # # #
    # & UPDATE / MODIFY         #
    @staticmethod
    def update_date_added_for_assets_list(assets_list, update=False, delta_days=0):
        """ modifies a list of assets with time additions
        """
        # 1) rewrite dates for the data
        if isinstance(assets_list, dict):
            assets_list = [assets_list]
        new_data = []
        for entry in assets_list:
            current_time = ut.get_utctime(delta_days=delta_days)
            entry["dateAdded"], entry["dateUpdated"] = current_time, current_time
            entry["tvlChange24h"], entry["tvlChange24hValue"] = "n/a", 0.0

            # 1.1) if update, remove unwanted keys if they're present, to avoid rewrite-blank
            if update and "new_asset" not in entry:  # 1.2) [HOTFIX] don't delete keys for brand new assets (!)
                fields_to_remove = ["dateAdded", "aprHistory", "tvlStakedHistory"] + ["tvlChange24h", "tvlChange24hValue"]
                for key in fields_to_remove:
                    try:
                        del entry[key]
                    except KeyError:
                        pass

            # 1.2) append the new recooked data
            new_data.append(entry)

        # 2) return the yield
        return new_data

    #############################
    # CORE                      #
    def receive_farm_post(self, data):
        """ specialized handling of these 'badboys'
        """
        # 0) make inner fn(s)
        def add_new_farm_and_its_assets():
            """ adds a new farm to the database
            """
            # 1) push farm entry => farm db
            entry = self.create_farm_insert_entry(farm_id, data, status, delta_days=delta_days)
            db_h.insert_entry(entry, "api", "farms")

            # 2)  push farm asset entries => assets db
            if inner_data:
                entries = self.update_date_added_for_assets_list(inner_data, delta_days=delta_days)
                for entry in entries:
                    # 2.1) add initial asset values
                    self.add_initial_30_d_historical_asset(entry, delta_days=delta_days)

                db_h.insert_entries(entries, "api", "assets")

        def update_farm_and_its_assets(old_farm):
            """ update a farm and it's assets
            """
            # 0) define inner fn(s)
            def hotfix_1(entry_given):
                """ modifies entry giving, uh, shit - new tvlStakedHistory and two sister fields
                    problem: cross-uses entry from both 'entry_given' (entry created for update purpose) and 'data' (entry in)
                """
                if "_entry_type" not in data:
                    farmId = entry_given["farmId"]
                    current_simple_time = ut.get_utctime(simple=True, delta_days=delta_days)

                    entry_given["tvlStakedHistory"] = [{"date": current_simple_time, "value": data["tvlFarm"]}]
                    logging.warning(f"hotfix_1() added new initial 'tvlStakedHistory' to farm '{farmId}'")

            # 1) add initial histories for entries that don't have 'em
            if isinstance(inner_data, dict):
                self.add_initial_30_d_historical_asset(inner_data, delta_days=delta_days)
            if isinstance(inner_data, list):
                for item in inner_data:
                    self.add_initial_30_d_historical_asset(item, delta_days=delta_days)

            # 2) apply set ACTIVE / INACTIVE feature
            old_assets = db_h.get_entries("api", "assets", {"farmId": farm_id}, them_all=True)
            l_ut.append_set_inactive_entries(inner_data, old_assets, status)

            # 3) get current active TVL + current active [21.09.2021 HOTFIX]
            if old_assets:
                inner_data_hotfix_replacement = hf.combine_current_and_old(inner_data, old_assets)
                data["active"], data["tvlFarm"] = l_ut.get_tvl_stamp_plus(inner_data_hotfix_replacement)

            # 4) update farm entry => farm db
            entry = self.create_farm_insert_entry(farm_id, data, status, update=True, delta_days=delta_days)
            # 4.1) update tvlHistory
            if "tvlStakedHistory" in old_farm:
                self.fill_30d_history(old_farm, entry, "tvlStakedHistory", "tvlStaked", delta_days)
            else:
                hotfix_1(entry)

            # 4.2) push to the database
            u_locks.apply_locks(entry, old_farm)
            db_h.update_entry({"farmId": farm_id}, entry, "api", "farms")

            if old_assets:
                # 5) create a dict of old_assets  # TODO: use later
                old_assets_dict = l_ut.create_old_assets_dict(old_assets)
                # 5.1) add 'new' tag for new assets
                l_ut.add_new_tag(inner_data, old_assets_dict)

            # 6) update asset entries => assets db
            inner_data_reformatted = inner_data
            if isinstance(inner_data_reformatted, dict):
                inner_data_reformatted = [inner_data_reformatted]

            entries = self.update_date_added_for_assets_list(inner_data_reformatted, update=True, delta_days=delta_days)
            for entry in entries:
                # 6.1) unpack assetId as 'asset_id' (in Python)
                asset_id = entry["assetId"]

                # 6.2) fill tvlHistories
                if old_assets and asset_id in old_assets_dict:
                    old_asset = old_assets_dict[asset_id]
                    # 6.2.1) skip 'set inactive' entries
                    if "debug_type" in entry:
                        del entry["debug_type"]  # remove the 'skip' value
                    # 6.2.2) update TVL and APR (active only)
                    else:
                        if entry["active"]:
                            self.fill_30d_history(old_asset, entry, "tvlStakedHistory", "tvlStaked", delta_days=delta_days)
                            try:
                                self.fill_30d_history(old_asset, entry, "aprHistory", "aprYearly", delta_days=delta_days)
                            except:
                                ut.save_json(entry, "ENTRY_PUSHED_AS_ACTIVE")
                                print("wtf?")
                                sys.exit(0)

                # 6.2.1) set it to none to avoid 'UnboundLocalVariable' error on 6.3.1)
                else:
                    old_asset = False

                # 6.3) push in
                # 6.3.1) apply locks if we have old entry (it may or may not contain locks)
                if old_asset:
                    u_locks.apply_locks(entry, old_asset)

                u_locks.init_locks_if_needed(entry, old_asset)  # 3rd Sept, _locks fix

                # 6.4.2) actually push in the entry
                query = {"assetId": asset_id}
                db_h.update_entry(query, entry, "api", "assets", upsert=True)

        # 0) unpack data at large if it's coming in as  {'data': x, 'delta_days': y} outer wrap
        # 0.1) unpack the (optional) 'delta_days'
        if "delta_days" in data:
            delta_days = data["delta_days"]
        else:
            delta_days = 0
        # 0.2) unpack the (optional) 'data' containing inner 'data' outer wrap
        if "data" in data:
            data = data["data"]

        # 1) check if farm exists
        farm_id = data["farmId"]
        status = data["status"]
        inner_data = data.get("data") or data  # AKA assets

        # 1.1) this technically is searching for the old 'farms' but will use only 1st entry
        entries_cursor = db_h.get_entries("api", "farms", {"farmId": farm_id})
        entries = db_h.cursor_to_list(entries_cursor)

        # 2) add / update
        # 2.1) if no existing farm, insert a new farm
        if not entries:
            # data["active"], data["tvlFarm"] = l_ut.get_tvl_stamp_plus(inner_data)
            add_new_farm_and_its_assets()

        # 2.2) else update with entries[0] as 'old_farm'
        else:
            old_farm = entries[0]
            update_farm_and_its_assets(old_farm)


scraper_push_handles = ScraperPushHandles()
