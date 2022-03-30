""" inner logic for all routes which require more-than-trivial logic behind them
"""
import copy
import logging
from typing import Optional, Dict
from urllib.parse import parse_qs
from flask import request

from multifarm_api.db_handles import db_handles as db_h
from multifarm_api.utils import utils as ut
from multifarm_api.inner_api_logic.data_entry_functionality import data_entry_functionality as d_e_f
from multifarm_api.inner_api_logic.scraper_push_handles import scraper_push_handles as s_p_h
from multifarm_api.inner_api_logic.update_locks import update_locks
from multifarm_api.inner_api_logic import backup_db as b_db

# new [new structure]
from multifarm_api.coin_group_filters.cg_logic import cg_logic
from multifarm_api.config import config as cf


class ApiHandles:
    #############################
    # DEMO ADMIN FUNCTIONALITY  #
    @staticmethod
    def admin_database(json_in):
        """ handle admin database commands 'backup', 'reset' (a backup json), 'delete' (a backup json), 'nuke'
        """

        # 0) define inner fn(s)
        def inner_backup():
            """ make a .json backup out of full API database
            """
            return b_db.make_db_backup(name)

        def inner_reset():
            return b_db.load_db_backup(name)

        def inner_delete():
            return b_db.delete_backup(name)

        def inner_nuke():
            return b_db.nuke_db()

        # 1) define constants
        methods_supported = ["help", "list_backups", "backup", "reset", "delete", "nuke"]
        methods_that_require_name = ["backup", "reset", "delete"]

        # 2) unpack json, check it's correct at general level, else - throw
        try:
            if "method" not in json_in:
                return "'method' key is required", 400
        except TypeError:
            return "POST body needs to be raw json!, like '{}'", 400

        # 3) unpack method
        method = json_in["method"]
        # 3.1) throw if it not supported
        if method not in methods_supported:
            return f"method '{method}' not found / not supported", 400

        # 3.2) throw no-name for [backup, reset, delete]
        if method in methods_that_require_name:
            # 3.2.1) throw
            if "name" not in json_in:
                return f"'name' key is required for this '{method}' method", 400

            # 3.2.2) unpack the actual name as outter-function-scope var
            name = json_in["name"]

        # 4) run the methods
        # 4.1) 'list_methods'
        if method == "help":
            return f"methods supported: {methods_supported}", 200

        # 4.2) 'list_backups'
        if method == "list_backups":
            lst_backups = b_db.return_list_backups()
            return lst_backups, 200

        # 4.3) 'backup'
        if method == "backup":
            return inner_backup()

        # 4.4) 'reset
        if method == "reset":
            return inner_reset()

        # 4.5) 'delete'
        if method == "delete":
            return inner_delete()

        # 4.6) 'nuke'
        if method == "nuke":
            return inner_nuke()

    @staticmethod
    def delete_entry_or_entries(json_in):
        """ fork of the data entry sibling-functionality
        """
        # 1) unpack json
        if not json_in:
            return "Needs raw JSON as POST body", 400

        # 2) validate / return bad status code early
        # 2.1) check if both required fields present
        if "type" not in json_in or "query" not in json_in:
            return "'type' and 'query' are required fields", 400

        # 2.2) validate 'query'
        query = json_in['query']
        if query == {}:
            return "query can't be '{}' (blank), that's too wide", 400

        # 2.3) validate 'type'
        db_type = json_in['type']
        if db_type not in ['farms', 'assets']:
            return f"'{db_type}' is a wrong 'type'", 400

        # 2) delete the stuff
        num_deleted = db_h.delete_entries(query, "api", db_type)
        if num_deleted:
            return f"successfully deleted #{num_deleted} entries", 200
        else:
            return f"didn't delete anything, likely query not found (such as if same delete query fired twice)", 200

    #############################
    # FOR PUSHING IN DATA       #
    @ut.time_it
    def process_scraper_push(self, data):
        """ process a farm push coming in from a scraper
        """
        def autocalc_tvls():
            """ I'm lazy, I want certain farms to trigger this
            """
            # 1) only do this only if specified so by config
            if cf.AUTOCALC_TOP_GRAPH:
                try:
                    inner_data = data["data"]
                except:
                    logging.error("wrong data in format, no inner 'data' on push farms")
                    return

                # 2) only do this for specific farmId(s)
                # 2.1) probably unnecessary precaution on unpacking to prevent crash, but it's okay
                if "farmId" in inner_data:
                    farmId = inner_data["farmId"]
                    if farmId in cf.AUTOCALC_TOP_GRAPH_FARM_IDS:

                        # 2.2) only do this if time is past 3 am
                        time_now = ut.get_utctime()
                        hour = time_now.split("T")[1].split(":")[0]
                        int_hour = int(hour)

                        # 2.3) calculate the actual TVLs if hour is 3am or higher
                        if int_hour >= 3:
                            self.calculate_global_tvls()
                            self.calculate_global_multi_selects()
                        else:
                            logging.info(f"tvlAutocalc hours limit hotfix prevented tvlAutocalc at '{time_now}'")

        # 1) pass whole data to the inner function
        s_p_h.receive_farm_post(data)

        # 2) also autocalc tvls on select farms
        autocalc_tvls()

    #############################
    # ADMIN DUMP ROUTES         #
    @staticmethod
    def admin_get_farms(active_only=False):
        """ return the farms
        """
        # 1) apply active
        if active_only:
            filters = {"active": True}
        else:
            filters = {}

        # 2) remove pagination limit, get data, set pagination limit back
        cf.PAGINATION_PER_PAGE = 1000000
        data = db_h.get_entries("api", "farms", filters)
        cf.PAGINATION_PER_PAGE = cf.PAGINATION_PER_PAGE_DEFAULT

        # 3) return the data
        return data

    @staticmethod
    def admin_get_assets(filters=None, active_only=False):
        """ return the assets
        """
        # 1) apply active
        filters = filters if filters else {}
        if active_only:
            filters["active"] = True

        # 2) remove pagination limit, get data, set pagination limit back
        cf.PAGINATION_PER_PAGE = 1000000
        data = db_h.get_entries("api", "assets", filters)
        cf.PAGINATION_PER_PAGE = cf.PAGINATION_PER_PAGE_DEFAULT

        # 3) return the data
        return data

    #############################
    # REGULAR ROUTES            #

    # # # # # # # # # # # # # # #
    # FARMS                     #
    @staticmethod
    def get_farms():
        """ get farms
        """

        # 0) define inner fn(s)
        def inner_get_farms():
            """ inner function that wraps around the db functionality
            """
            data = {
                "max_pages": db_h.get_entries("api", "farms", filters, get_page_count=True),
                "data": db_h.get_entries("api", "farms", filters, sort, pg)
            }
            return data

        # 1) apply basic filters
        filters = {}  # init blank filters
        query_string_dict = parse_qs(request.query_string.decode())  # parse query string
        try:
            ut.fill_basic_filter_from_query_string(filters, query_string_dict)
        except ValueError as e:
            return str(e).split("#")

        # 2) apply extra filters: search, pagination &, on top, search functionality
        try:
            search_str = ut.add_search_filter(filters, query_string_dict)
            pg = ut.get_pagination()
            sort = ut.extract_sort_from_qs(query_string_dict, "farm")
        except ValueError as e:
            return str(e).split("#")

        # 3) paginate and return the data
        data = inner_get_farms()
        ut.get_pagination_teardown()  # [TEMP]

        # 3.1) [EXP] add search syntax hl
        if search_str:
            ut.add_highlight(data, search_str, "farms")

        return data, 200

    @staticmethod
    def get_farm(farm_id):
        """ get farm by farm_id
        """
        entries = db_h.get_entries("api", "farms", {"farmId": farm_id})
        if entries:
            return entries[0]
        else:
            return {}

    # # # # # # # # # # # # # # #
    # ASSETS                    #
    @staticmethod
    def get_assets(filters=None):
        """ get assets, 30d historicals removed
        """
        filters = filters if filters else {}
        # 0) define inner fn(s)

        def inner_get_assets():
            """ inner function that wraps around the db functionality
            """
            data = {
                "max_pages": db_h.get_entries("api", "assets", filters, get_page_count=True),
                "data": db_h.get_entries("api", "assets", filters, sort, pg)
            }
            return data

        # 1) filters:
        filters = {}  # init blank filters
        query_string_dict = parse_qs(request.query_string.decode())  # parse query string
        try:
            ut.fill_basic_filter_from_query_string(filters, query_string_dict)
        except ValueError as e:
            return str(e).split("#")

        # 1.1) extra filters for assets
        ut.fill_all_assets_endpoint_filter(filters, query_string_dict)  # apr_yearly_min, apr_yearly_max

        # [EXPERIMENTAL] 1.2) even more (combined) filters for assets
        ut.fill_experimental_assets_combo_filters(filters, query_string_dict)

        # 2) apply extra filters: search, pagination &, on top, search functionality
        try:
            search_str = ut.add_search_filter(filters, query_string_dict, "assets")
            pg = ut.get_pagination()
            sort = ut.extract_sort_from_qs(query_string_dict, "asset")
        except ValueError as e:
            return str(e).split("#")

        # 3) paginate and return the data
        data = inner_get_assets()
        ut.get_pagination_teardown()  # [TEMP]

        # 3.1) [EXP] add search syntax hl
        if search_str:
            ut.add_highlight(data, search_str, "assets")

        return data, 200

    @staticmethod
    def get_assets_by_farm_id(farm_id, reduce=True):
        """ get assets by farm id, 30d historicals removed
            'reduce' = reduce for user consumption, set to 'False' to not reduce
        """
        my_filter = {"farmId": farm_id}
        entries = db_h.get_entries("api", "assets", my_filter)
        if reduce:
            ut.reduce_list_of_dict_fields(entries, ["aprHistory", "tvlStakedHistory", "rewardTokenPriceHistory"])

        return entries

    @staticmethod
    def get_asset_by_asset_id(asset_id):
        """ get a single asset, full details
        """
        my_filter = {"assetId": asset_id}
        entries = db_h.get_entries("api", "assets", my_filter)
        return entries[0]

    @staticmethod
    def get_asset_details(asset_id):
        """ get asset details
        """

        # 0) define inner fn(s)
        def get_asset_by_asset_id():
            my_filter = {"assetId": asset_id}
            entries = db_h.get_entries("api", "assets", my_filter)
            return entries[0]

        # 1) main logic
        if asset_id:
            data = get_asset_by_asset_id()
            resp, status = data, 200
        else:
            resp, status = "not a valid 'assetId' specified yo?", 400

        # 2) return data
        ut.censor_resp_to_users(resp)
        return resp, status

    #############################
    # CALCULATE GLOBALS         #
    def calculate_global_tvls(self):
        """ calculate up global TVLs
        """
        farms = self.admin_get_farms(active_only=True)
        TVLS = {}

        # 1) extract farms
        for farm in farms:
            tvl_hist = farm["tvlStakedHistory"]
            chain = farm["blockchain"]
            for item in tvl_hist:
                date = item["date"]
                value = item["value"]
                if chain not in TVLS:
                    TVLS[chain] = {date: value}
                else:
                    if date not in TVLS[chain]:
                        TVLS[chain][date] = value
                    else:
                        try:
                            TVLS[chain][date] += value
                        except TypeError:
                            TVLS[chain][date] += 0.0

        # 2) count all together
        TVLS_ALL = {}
        for chain in TVLS:
            for date in TVLS[chain]:
                # 1) extract value
                value = TVLS[chain][date]

                # 2.1) set new
                if date not in TVLS_ALL:
                    TVLS_ALL[date] = value
                # 2.2) count it up
                else:
                    TVLS_ALL[date] += value

        # 2.1) now append 'ALL' when it has finished counting
        TVLS["ALL"] = TVLS_ALL

        # 3) repack everything up
        RESULTS = {}
        for chain in TVLS:
            inner = TVLS[chain]
            inner_array = []
            for date in inner:
                value = inner[date]
                inner_array.append({'date': date, 'value': round(value, 2)})

            # 3.1) sort to avoid a possible edge-case of wrong order
            inner_array.sort(key=lambda x: x['date'], reverse=True)

            # 3.2) cap to 30 days
            inner_array = inner_array[:30]
            RESULTS[chain] = inner_array

        # 4) in-api-functionality
        updated_entry = {
            "data": RESULTS,
            "updated": ut.get_utctime(simple=True)
        }

        # 5) update the fucker
        db_h.update_entry({"global_id": "global_graphs"}, updated_entry, "api", "globals", upsert=True)
        # & log
        logging.info("global 30d graphs recalculated")

    def calculate_global_multi_selects(self):
        """ calculate dropdown (or FE search) dropdown options for the possible multiselect filters
        """

        # 0) definer inner fn(s)
        def add_list_of_uniques(lst, field, name):
            """ lst = list of dict that has this field
                field = the field we want to make list of uniques for
                name = name in output dict
            """
            # 1) init dictionary
            uniques = {}

            # 2) iterate and calc
            for item in lst:
                value = item[field]
                if value:  # 2.1) skip empty ones
                    if value not in uniques:
                        uniques[value] = True

            # 3) sort, add into results
            lst = list(uniques)
            lst.sort()
            results[name] = lst

        # 1) init vars
        results = {}

        # 1.1) get farms and assets data
        farms = self.admin_get_farms()
        assets = self.admin_get_assets()

        # 2) calculate farms (all) and (by chain)
        all_farm_names = {}
        farms_by_chain = {}
        for farm in farms:
            name = farm["farmName"]
            chain = farm["blockchain"]
            farmId = farm["farmId"]
            # 2.1) normal
            if name not in all_farm_names:
                all_farm_names[name] = farmId

            # 2.2) by chain
            if chain not in farms_by_chain:
                farms_by_chain[chain] = {name: farmId}
            else:
                if name not in farms_by_chain[chain]:
                    farms_by_chain[chain][name] = farmId

        # 3) ILYA rework 12th July 2021
        # 3.1) simple
        farms_new = []
        farms_index = sorted(all_farm_names)
        for farm_key in farms_index:
            farms_new.append({"name": farm_key, 'farmId': all_farm_names[farm_key]})

        # 3.2)
        farms_by_chain_new = {}
        chains_index = sorted(farms_by_chain)
        for chain_key in chains_index:
            farms_index = sorted(farms_by_chain[chain_key])
            farms_by_chain_inner_lst = []
            for farm_key in farms_index:
                farms_by_chain_inner_lst.append({"name": farm_key, 'farmId': farms_by_chain[chain_key][farm_key]})

            farms_by_chain_new[chain_key] = copy.deepcopy(farms_by_chain_inner_lst)

        # 3.3) chains available
        chains_available_dict = {}
        for i, item in enumerate(farms_by_chain_new, 1):
            try:
                score = cf.CHAIN_ORDER[item]
            except:
                score = 999 + i

            chains_available_dict[item] = score

        # [note] I'm probably doing lambda x wrong, but it still works so 'ok' for now
        chains_available = sorted(chains_available_dict, key=lambda x: chains_available_dict[x])

        # 4) Dump in
        results["chains_available"] = chains_available
        results["farms"] = farms_new  # normal
        results["farms_by_chain"] = farms_by_chain_new  # by chain

        # 5) calculate the others
        # 5.1) Yield-Type
        add_list_of_uniques(assets, "yieldType", "yield_type_select")
        # 5.2) Category
        add_list_of_uniques(assets, "category", "category_select")
        # 5.3) Exchange
        add_list_of_uniques(assets, "exchangeName", "exchange_select")

        # 6) insert to db
        insert_entry = {"data": results, "updated": ut.get_utctime(simple=True)}
        db_h.update_entry({"global_id": "global_selects"}, insert_entry, "api", "globals", upsert=True)
        # & log
        logging.info("global selects recalculated")

    #############################
    # DISPLAY GLOBAL GRAPHS     #
    @staticmethod
    def get_global_30d_graph_tvls():
        """ just get global TVLs UP
        """
        _entries = db_h.get_entries("api", "globals", {"global_id": "global_graphs"})
        if not _entries:
            return "Global graphs have not yet been calculated", 404
        else:
            entry = _entries[0]
            del entry["global_id"]
            return entry, 200

    @staticmethod
    def get_global_selects(farms=True):
        """ just get global selects UP
        """
        # 1) get
        _entries = db_h.get_entries("api", "globals", {"global_id": "global_selects"})
        if not _entries:
            return "Global multi-selects have not yet been calculated", 404
        else:
            entry = _entries[0]

            # 2) farms split update 2021.09.09
            farm_keys = ["farms", "farms_by_chain"]
            # 2.1) farms = false
            if not farms:
                for a_key in farm_keys:
                    if a_key in entry["data"]:
                        del entry["data"][a_key]

            # 2.2) solo
            if farms == "solo":
                entry_new = {}
                for a_key in farm_keys:
                    if a_key in entry["data"]:
                        entry_new[a_key] = entry["data"][a_key]

                if "updated" in entry:
                    entry_new["updated"] = entry["updated"]

                entry = entry_new

            # 2._) default = nothing extra happens

            # 3) clean up and return
            if "global_id" in entry:
                del entry["global_id"]

            return entry, 200

    #############################
    #  DATA ENTRY               #

    #############################
    # DATA ENTRY UTILS          #

    def produce_asset_id_list_by_farm_id(self, farm_id):
        """ produce asset id list
        """
        # 1) produce this list
        asset_id_lst = []
        all_farm_assets = self.admin_get_assets({"farmId": farm_id}, False)
        for asset in all_farm_assets:
            asset_id_lst.append(asset["assetId"])

        # 2 return this yield
        return asset_id_lst

    #############################
    # POST ENDPOINTS            #
    # 1) edit assets or farms [POST] (GET)
    def edit_assets_or_farms_post_get(self, json_in):
        """ get asset, farm or assets + farms data to illustrate what fields can be edited
        """

        # 0) define inner fn(s)
        # 0.1) return data for a single farm
        def return_fields_and_locks_for_a_single_farm(farm_id):
            """ return fields + locks for an inner 'single' farm
            """
            # 1) pick and throw 'no results'
            entries = db_h.get_entries("api", "farms", {"farmId": farm_id})
            if not entries:
                return f"no such '{farmId}' farmId within the db, soz", 404

            # 2) unpack data
            raw_entry = entries[0]
            entry = d_e_f.unpack_single_entry(raw_entry, "farms")
            # & return the entry as 'result'
            return entry, 200

        # 0.2) return data for a list of farms
        def return_fields_and_locks_for_a_farm_list(farm_ids):
            """ return fields + locks for a list of farm entries
            """
            # 1) pick and throw 'no results'
            cf.PAGINATION_PER_PAGE = 100000
            raw_entries = db_h.get_entries("api", "farms", {"farmId": {"$in": farm_ids}})
            cf.PAGINATION_PER_PAGE = cf.PAGINATION_PER_PAGE_DEFAULT

            if len(raw_entries) != len(farm_ids):
                return f"found #{len(raw_entries)} instead of #{len(farm_ids)} " \
                       "expected farms, please contact your developer if want this handled " \
                       "or more info given", 501

            # 2) unpack data
            entries = d_e_f.unpack_multiple_entries(raw_entries, "farms")

            # & return as 'results'
            return entries, 200

        # TODO: maybe dry both farm and asset into one, could be less code lines
        # 0.3) return data for a single asset
        def return_fields_and_locks_for_a_single_asset(asset_id):
            """ return fields + locks for an inner 'single' asset
            """
            # 1) pick and throw 'no results'
            entries = db_h.get_entries("api", "assets", {"assetId": asset_id})
            if not entries:
                return f"no such '{asset_id}' assetId within the db, soz", 404

            # 2) unpack data
            raw_entry = entries[0]
            entry = d_e_f.unpack_single_entry(raw_entry, "assets")
            # & return the entry as 'result'
            return entry, 200

        # 0.4) return data for a list of assets
        def return_fields_and_locks_for_an_asset_list(asset_ids):
            """ return fields + locks for a list of asset entries
            """
            # 1) pick and throw 'no results'
            cf.PAGINATION_PER_PAGE = 100000
            raw_entries = db_h.get_entries("api", "assets", {"assetId": {"$in": asset_ids}})
            cf.PAGINATION_PER_PAGE = cf.PAGINATION_PER_PAGE_DEFAULT
            if len(raw_entries) != len(asset_ids):
                return f"found #{len(raw_entries)} instead of #{len(asset_ids)} " \
                       "expected assets, please contact your developer if want this handled " \
                       "or more info given", 501

            # 2) unpack data
            entries = d_e_f.unpack_multiple_entries(raw_entries, "assets")

            # & return as 'results'
            return entries, 200

        # 1) throw entries without raw json body
        if not json_in:
            return "Needs raw JSON as POST body", 400

        # TODO: dry rewrite via count or something like that
        # 1.1) throw entries which have both 'farmId' and 'farmIds'
        if 'farmId' in json_in and 'farmIds' in json_in:
            r_txt = "'farmId' for single farm, 'farmIds' for 1 or more farms returned as a list " \
                    "- pick ONE! No can both!"
            return r_txt, 400

        # 1.2) throw entries which have both 'assetId' and 'assetIds'
        if 'assetId' in json_in and 'assetIds' in json_in:
            r_txt = "'assetId' for single asset, 'farmIds' for 1 or more assets returned as a list " \
                    "- pick ONE! No can both!"
            return r_txt, 400

        # 2) handle farm / farms
        # 2.1) handle 'farmId' (single farm)
        if "farmId" in json_in:
            farmId = json_in["farmId"]

            # 2.1.1) throw if applicable
            if not isinstance(farmId, str):
                return "don't mess inner value plx", 400

            # 2.1.2) handle with the inner handle
            return return_fields_and_locks_for_a_single_farm(farmId)

        # 2.2) handle 'farmIds' (farm or farms as array)
        if "farmIds" in json_in:
            farmIds = json_in["farmIds"]

            # 2.2.1) throw if is not a list
            if not isinstance(farmIds, list):
                return "farmIds needs to be a list, like: [<farmId_1>, <farmId_2> ...]", 400

            # 2.2.2) throw if is empty
            if not farmIds:
                return "farmIds list can't be empty, put some farmIds in it!", 400

            # 2.2.3) handle with the inner handle
            return return_fields_and_locks_for_a_farm_list(farmIds)

        # 2.3) handle 'assetId' (single asset)
        if "assetId" in json_in:
            assetId = json_in["assetId"]

            # 2.3.1) throw if applicable
            if not isinstance(assetId, str):
                return "don't mess inner value plx", 400

            # 2.3.2) handle with the inner handle
            return return_fields_and_locks_for_a_single_asset(assetId)

        # 2.4) handle 'assetIds' (asset or assets as array)
        if "assetIds" in json_in:
            assetIds = json_in["assetIds"]

            # 2.4.1) throw if is not a list
            if not isinstance(assetIds, list):
                return "assetsIds needs to be a list, like: [<assetId_1>, <assetId_2> ...]", 400

            # 2.4.2) throw if is empty
            if not assetIds:
                return "assetIds list can't be empty, put some assetIds in it!", 400

            # 2.4.3) handle with the inner handle
            return return_fields_and_locks_for_an_asset_list(assetIds)

        # 2.5) handle 'assetsByFarmId'
        if "assetsByFarmId" in json_in:
            farmId = json_in["assetsByFarmId"]

            # 2.5.1) throw if not str
            if not isinstance(farmId, str):
                return "'assetsByFarmId' value must be a string (currently only 1x farm supported)", 400

            # 2.5.2) get assetIds in a 'hacked' manner
            asset_id_lst = self.produce_asset_id_list_by_farm_id(farmId)

            # 2.5.3) reuse '2.4.3) handle with the inner handle'
            return return_fields_and_locks_for_an_asset_list(asset_id_lst)

        # Z) return bad request
        return "bad request", 400

    # 3) edit assets or farms [POST] (DELETE)
    @staticmethod
    def edit_assets_or_farms_post_delete(json_in):
        # 0) define inner functions
        # 0.1) get fields we want to get
        def get_id_field_db_name_and_multi():
            """ gets:
                'id_field' field to identify entry in db
                'db_name' to identify the db
                'multi' to decide if it's multi-entries or single
            """

            # 1) iterate list of possible keys and count how many hits we get
            count = 0
            real_key = ""
            for a_key in POSSIBLE_IDS:
                if a_key in json_in:
                    real_key = a_key
                    count += 1

            # 2) throw
            # 2.1) if zero
            if count == 0:
                raise ValueError(f"needs at least one of: '{POSSIBLE_IDS}' to identify what edit to make#400")

            # 2.2) if more than 1
            if count > 1:
                raise ValueError(f"pick only one of: '{POSSIBLE_IDS}' - we don't support multi-choices#400")

            # 3) switch, pick which is which
            # 3.1) 'farmId'
            if real_key == "farmId":
                return real_key, "farmId", "farms", False

            # 3.2) 'farmIds'
            if real_key == "farmIds":
                return real_key, "farmId", "farms", True

            # 3.3) 'assetId'
            if real_key == "assetId":
                return real_key, "assetId", "assets", False

            # 3.4) 'assetIds'
            if real_key == "assetIds":
                return real_key, "assetId", "assets", True

            # 3.5) 'byFarmId'
            if real_key == "assetsByFarmId":
                return real_key, "farmId", "assets", True

        # 0.2) process single
        def process_a_single_entry():
            """ delete a single assetId / farmId
            """
            query = {id_field: id_value_field}
            res = db_h.delete_entry(query, "api", db_name)
            return res

        def process_multiple():
            """ multi-delete multiple assetIds / farmIds
            """
            # 1.1) pick assets '$in'
            if real_key != "assetsByFarmId":
                query = {id_field: {"$in": id_value_field}}
            # 1.2) or pick assets by 'farmId'
            else:
                query = {id_field: id_value_field}

            res = db_h.delete_entries(query, "api", db_name)
            return res

        # 1) define constants
        POSSIBLE_IDS = ["farmId", "farmIds", "assetId", "assetIds", "assetsByFarmId"]

        # 2) get stuff from json in
        # 2.1) get correct id_fields+
        try:
            real_key, id_field, db_name, multi = get_id_field_db_name_and_multi()
        # 2.1.1) or throw if they're not correct
        except ValueError as e:
            text, status_raw = str(e).split("#")
            status = int(status_raw)
            return text, status

        # 3) handle non-multi(s) (TO DO)
        # 3.1) unpack 'id_value_field'
        id_value_field = json_in[real_key]

        # 3.2) single entry
        if not multi:
            if process_a_single_entry():
                return "deleted 1 or more entries", 200
            else:
                return "didn't delete any entries, I think", 303

        # 3.3) multi-entries
        if multi:
            if process_multiple():
                return "deleted 1 or more entries", 200
            else:
                return "didn't delete any entries, I think multi", 303

    #############################
    # PUT ENDPOINTS             #

    @staticmethod
    def set_assets_inactive(farm_id: Optional[str], active_field: Optional[Dict[str, str]]) -> bool:
        """
        Updates assets as inactive if farm is set inactive
        """
        fields_exist = farm_id and active_field
        if not fields_exist:
            return False
        value = active_field.get("value")
        if not value:
            return False
        db = db_h.get_db("api", "assets")
        update = db.update_many({"farmId": farm_id}, {"$set": {"active": value}})
        return bool(update.modified_count)

    # 1) edit assets or farms [PUT]
    def edit_assets_or_farms_put(self, json_in):
        # 0) define inner functions
        # 0.1) get fields we want to get
        def get_id_field_db_name_and_multi():
            """ gets:
                'id_field' field to identify entry in db
                'db_name' to identify the db
                'multi' to decide if it's multi-entries or single
            """

            # 1) iterate list of possible keys and count how many hits we get
            count = 0
            real_key = ""
            for a_key in POSSIBLE_IDS:
                if a_key in json_in:
                    real_key = a_key
                    count += 1

            # 2) throw
            # 2.1) if zero
            if count == 0:
                raise ValueError(f"needs at least one of: '{POSSIBLE_IDS}' to identify what edit to make#400")

            # 2.2) if more than 1
            if count > 1:
                raise ValueError(f"pick only one of: '{POSSIBLE_IDS}' - we don't support multi-choices#400")

            # 3) switch, pick which is which
            # 3.1) 'farmId'
            if real_key == "farmId":
                return real_key, "farmId", "farms", False

            # 3.2) 'farmIds'
            if real_key == "farmIds":
                return real_key, "farmId", "farms", True

            # 3.3) 'assetId'
            if real_key == "assetId":
                return real_key, "assetId", "assets", False

            # 3.4) 'assetIds'
            if real_key == "assetIds":
                return real_key, "assetId", "assets", True

            # 3.5) 'assetsByFarmId'
            if real_key == "assetsByFarmId":
                return real_key, "farmId", "assets", True

        # 0.2) check if those fields are valid or throw error early
        def validate_fields():
            """ validates fields
            """
            for key in fields:
                value = fields[key]
                if not isinstance(value, dict):
                    raise ValueError("fields sub dict is not dict#200")

                if "value" not in value and "locked" not in value:
                    raise ValueError("fields sub dict needs, at minimum, 'value' or 'locked' fields#200")

        # 0.3) process single
        def process_a_single_entry(id_field_value):
            """ process a single entry
            """
            # 1) make edit query
            edit_query = {id_field: id_field_value}

            # 2) grab historical entry
            entries = db_h.get_entries("api", db_name, edit_query)
            if not entries:
                return f"No '{db_name}' db entry with '{id_field_value}' {id_field}", 400
            else:
                historical_entry = entries[0]

            # 3) get edits needed
            edits = d_e_f.get_edits_from_fields(fields)  # fields = {}, needs_locks {}, locks_off {}
            # & get locks based off those edits
            locks = update_locks.get_new_locks(historical_entry, edits["lock_true"], edits["lock_false"])

            # 4) apply db change
            fields_to_update = copy.deepcopy(edits["values"])  # probably unnecessary deepcopy here, not 100% sure tho'
            fields_to_update["_locks"] = locks

            # 5) update stuff
            _ = db_h.update_entry(edit_query, fields_to_update, "api", db_name)
            if _:
                return True
            else:
                return False

        # 1) define constants
        POSSIBLE_IDS = ["farmId", "farmIds", "assetId", "assetIds", "assetsByFarmId"]

        # 2) get stuff from json in
        # 2.1) get correct id_fields+
        try:
            real_key, id_field, db_name, multi = get_id_field_db_name_and_multi()

        # 2.1.1) or throw if they're not correct
        except ValueError as e:
            text, status_raw = str(e).split("#")
            status = int(status_raw)
            return text, status

        # 2.2) get fields (dict of stuff to modify) or throw
        try:
            fields = json_in["fields"]
            # Quick hack to set assets inactive, whole API will be rewritten later
            self.set_assets_inactive(json_in.get("farmId"), fields.get("active"))
            if not isinstance(fields, dict):
                raise ValueError("fields needs to be a dict of 'key': {'value': <value>, 'locked': <value>}#400")

            validate_fields()

        except KeyError:
            return "needs 'fields' (containing fields to modify)", 400

        except ValueError as e:
            text, status_raw = str(e).split("#")
            status = int(status_raw)
            return text, status

        # 3) handle non-multi(s) (TO DO)
        # 3.1) single entry
        if not multi:
            id_value_field = json_in[id_field]
            try:
                if process_a_single_entry(id_value_field):
                    return "entry updated", 200
                else:
                    return "not modified tho'", 303

            except ValueError as e:
                text, status_raw = str(e).split("#")
                status = int(status_raw)
                return text, status

        # 3.2) multi-entries
        if multi:
            try:
                real_key_value = json_in[real_key]
                # return f"real_key {real_key_value}", 200
                count = 0

                # 3.2.1) unpack normal or get assetId list, 3rd August Update
                if real_key == "assetsByFarmId":
                    asset_ids_list = self.produce_asset_id_list_by_farm_id(real_key_value)
                    id_field = "assetId"  # August 3rd Hotfix
                else:
                    asset_ids_list = real_key_value

                # 3.2.2) execute
                for i, id_value_field in enumerate(asset_ids_list, 1):
                    if process_a_single_entry(id_value_field):
                        count += 1

                # 3.2.3) return respective stuff based off 'count'
                if i == count:
                    return f"updated all #{i} entries to update", 200

                elif count > 0:
                    return f"modified #{count}/{i} entries - a partial update", 200

                else:
                    return "not modified tho' (multi-update)", 303

            except ValueError as e:
                text, status_raw = str(e).split("#")
                status = int(status_raw)
                return text, status

    #############################
    # EDIT GLOBALS              #
    @staticmethod
    def edit_globals(request):
        """ edit globals
        """

        # 0) define inner fn(s)
        def handle_put():
            """ handle inner put request
            """
            # 1) unpack data
            try:
                data = request.get_json()
            except:
                raise ValueError("can't decode JSON#400")

            # 2) get attribute
            try:
                info_html = data["announcement"]
                if not isinstance(info_html, str):
                    raise ValueError("throw!")
            except:
                raise ValueError("need valid 'announcement' of type 'str'#400")

            # 3.1) return 'False' if same, not updated (don't need to change updated_date)
            old_entry_query = db_h.get_entries("api", "globals", {"global_id": "global_selects"})
            if old_entry_query:
                old_entry = old_entry_query[0]
                if "announcement" in old_entry:
                    old_info_html = old_entry["announcement"]
                    if old_info_html == info_html:
                        return False

            # 3.2) return 'True' if updated successfully
            insert_entry = {"announcement": info_html, "announcementUpdated": ut.get_utctime(True)}
            db_h.update_entry({"global_id": "global_selects"}, insert_entry, "api", "globals", upsert=True)
            return True

        # 1) handle 'GET'
        if request.method == "GET":
            _entries = db_h.get_entries("api", "globals", {"global_id": "global_selects"})
            if not _entries:
                return "global multi-selects + announcement not yet set", 404
            else:
                entry = _entries[0]
                if "announcement" in entry:
                    ann, ann_updated = entry["announcement"], entry["announcementUpdated"]
                else:
                    ann, ann_updated = None, None

                return {"announcement": ann, "announcementUpdated": ann_updated}, 200

        # 2) handle 'PUT'
        try:
            _ = handle_put()
            if _:
                return "Set successfully", 200
            else:
                return "Not updated tho'", 200

        except ValueError as e:
            text, status_raw = str(e).split("#")
            return text, int(status_raw)

    #############################
    # GLOBAL COINS UPDATE       #
    @staticmethod
    @ut.time_it
    def calculate_global_coins():
        """ calculate global coins
        """
        cg_logic.recalculate_available_coins_dict()
        return True

    @staticmethod
    def return_global_coins():
        """ return calculated global coins
        """
        coins = cg_logic.return_global_by_global_id("coin_list", "global_coins_dict")
        coin_groups = cg_logic.return_global_by_global_id("coin_groups")

        response = {
            "coins": coins,
            "coin_groups": coin_groups
        }

        return response

    @staticmethod
    def edit_coin_group_filters(data):
        """ edit coin group filters
        """
        resp, status = cg_logic.edit_coin_group_filters(data)
        return resp, status


api_handles = ApiHandles()
