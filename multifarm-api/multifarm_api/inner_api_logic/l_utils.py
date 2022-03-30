from datetime import datetime, timezone
from multifarm_api.config import config as cf


class LUtils:
    #############################
    # HELPERS                   #
    @staticmethod
    def create_old_assets_dict(old_assets_list):
        """ create old assets dictionary
        """
        # 1) create dictionary based on 'assetId' key
        dictionary = {}
        for entry in old_assets_list:
            key = entry["assetId"]
            if key not in dictionary:  # 18th June HOTFIX to avoid '_locks' not taking affects for stuff which has dups
                dictionary[key] = entry

        # 2) return the dictionary
        return dictionary

    #############################
    # SUB-FUNCTIONALITY         #

    # # # # # # # # # # # # # # #
    # 1) ACTIVE / INACTIVE      #
    @staticmethod
    def append_set_inactive_entries(new_assets, old_assets, status):
        """ append old entries to set to inactive
            note, lists are mutable, this method mutates the list given to it
        """

        if not old_assets:
            return

        def create_asie_dump():
            """ inactive code that was used for making debug dump
            """
            # 0) asie = APPEND-SET-INACTIVE-ENTRIES; dump for sample
            # farmId = old_assets[0]["farmId"]

            # 20th September code which was used to create testing dump
            # # make json and filename
            # asie_dump_name = f"{farmId}_{status}"
            # asie_json = {
            #     "farmId": farmId,
            #     "status": status,
            #     "new_assets": new_assets,
            #     "old_assets": old_assets
            # }
            # # & dump
            # ut.save_json(asie_json, asie_dump_name)

        # 1) create keys of new entries (for 'success' and 'partial' only)
        if status in ["success", "partial"]:
            new_keys = {}
            if isinstance(new_assets, dict):
                new_assets = [new_assets]
            for n_asset in new_assets:  # n_asset stands for 'new asset'
                new_keys[n_asset["assetId"]] = "_"

        # 2) handle 'success' = add all unique olds as 'active => False'; if they're not in 'success' they're not relevant.
        # [NOTE] this is dangerous, maybe, later, we could check if success is / isn't valid more and fix up edge cases.
        # [NOTE] atm just roll, tho'.
        if status == "success":
            for o_asset in old_assets:
                asset_id = o_asset["assetId"]
                if asset_id not in new_keys:
                    entry = {"assetId": asset_id, "active": False, "debug_type": "to_deactivate_update"}
                    new_assets.append(entry)

            # 2.1) 'return' to end the switch
            return

        # 3) handle 'partial' = add all unique as 'active => False' if they're older than_max_allowed_time
        if status == "partial":
            for o_asset in old_assets:
                asset_id = o_asset["assetId"]
                if asset_id not in new_keys:
                    # & calculate timedelta
                    then = datetime.fromisoformat(o_asset["dateUpdated"])
                    now = datetime.now(timezone.utc)
                    delta = now - then

                    # & set inactive assets older than allowed config timedelta
                    if delta > cf.MAX_ASSET_AGE:
                        entry = {"assetId": asset_id, "active": False, "debug_type": "to_deactivate_update"}
                        if cf.SET_TVL_FIELDS_ON_DEACTIVATE:
                            entry["tvlChange24h"] = "n/a"
                            entry["tvlChange24hValue"] = 0.0

                        new_assets.append(entry)

            # 3.1) 'return' to end the switch
            return

        # 4) handle fail, return results
        if status == "failed":
            for o_asset in old_assets:
                # & calculate timedelta
                then = datetime.fromisoformat(o_asset["dateUpdated"])
                now = datetime.now(timezone.utc)
                delta = now - then

                # & set inactive assets older than allowed config timedelta
                if delta > cf.MAX_ASSET_AGE:
                    asset_id = o_asset["assetId"]
                    entry = {"assetId": asset_id, "active": False, "debug_type": "to_deactivate_update"}
                    if cf.SET_TVL_FIELDS_ON_DEACTIVATE:
                        entry["tvlChange24h"] = "n/a"
                        entry["tvlChange24hValue"] = 0.0

                    new_assets.append(entry)

            # 4.1) 'return' to end the switch
            return

        # 5) raise ValueError if got here (wrong status given)
        raise ValueError(f"wrong status given {status}")

    # # # # # # # # # # # # # # #
    # 2) Add 'New!' Tag         #
    @staticmethod
    def add_new_tag(asset_list, old_dict):
        """ adds 'new' tag (used to NOT remove 'add_new' fields)
        """
        if isinstance(asset_list, dict):
            asset_list = [asset_list]
        for asset in asset_list:
            asset_id = asset["assetId"]
            if asset_id not in old_dict:
                asset["new_asset"] = True

    # # # # # # # # # # # # # # #
    # 3) TVL                    #
    @staticmethod
    def get_tvl_stamp_plus(asset_list):
        """ returns 'isActive' + 'tvlStamp'
        """
        # 1) get both values and sum up tvlStaked
        total = 0.0
        is_active = False

        for asset in asset_list:
            if asset["active"]:
                is_active = True
                if isinstance(asset["tvlStaked"], str):
                    asset["tvlStaked"] = float(asset["tvlStaked"].replace(",", ""))
                total += asset["tvlStaked"]

        # 2) return results
        return is_active, round(total, 2)


l_utils = LUtils()