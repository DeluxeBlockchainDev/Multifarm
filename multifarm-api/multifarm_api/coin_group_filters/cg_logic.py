from multifarm_api.config import config as cf
from multifarm_api.db_handles import db_handles as db_h


class CGLogic:

    @staticmethod
    def recalculate_available_coins_dict():
        """ count up all token1, token2
            and set this to globals
        """
        # 0) define inner fn(s)
        def inner():
            """ do the calculation itself
            """
            # 1) create assets dict
            ASSETS_DICT = {}

            # 2) pick
            cf.PAGINATION_PER_PAGE = 1000000
            assets = db_h.get_entries("api", "assets")
            cf.PAGINATION_PER_PAGE = 50

            # 2.1) iterate over it
            for i, asset in enumerate(assets, 1):
                asset_1 = asset['tokenA']
                asset_2 = asset['tokenB']

                for _asset in [asset_1, asset_2]:
                    _asset_no_dollar = _asset.upper().replace("$", "_")

                    # 3) count
                    # 3.1) new _asset_no_dollar (not found)
                    if _asset_no_dollar not in ASSETS_DICT:
                        ASSETS_DICT[_asset_no_dollar] = {
                            "names": [_asset],
                            "total": 1
                        }
                    else:
                        # 3.2.0) count up (universal)
                        ASSETS_DICT[_asset_no_dollar]["total"] += 1

                        # 3.2.1) new _asset under _asset_no_dollar
                        if _asset not in ASSETS_DICT[_asset_no_dollar]["names"]:
                            ASSETS_DICT[_asset_no_dollar]["names"].append(_asset)

            # 3) sort and remove 1x non-needed value
            ASSETS_DICT = dict(sorted(ASSETS_DICT.items(), key=lambda item: item[1]["total"], reverse=True))
            if "" in ASSETS_DICT:
                del ASSETS_DICT[""]

            # 4) return
            return ASSETS_DICT

        # 1) setup query and entry
        query = {"global_id": "coin_list"}
        entry = {"global_coins_dict": inner()}

        # 2) update it up
        db_h.update_entry(query, entry, "api", "globals", upsert=True)

    def edit_coin_group_filters(self, data):
        """ edit coin group filters
        """
        def validate():
            """ does nothing if valid, else raises ValueError
            """
            # 1) groups
            if "groups" not in data:
                raise ValueError("no 'groups' sub-field #400")

            # 2) uppercase and all 3 sub-fields present
            for group_key in data["groups"]:
                # 2.1) isUpper()
                if group_key != group_key.upper():
                    raise ValueError(f"group '{group_key}' needs to be in UPPERCASE#400")

                # 2.2.1) has all the fields
                for item in ["display_name", "includes_coins", "includes_groups"]:
                    if item not in data["groups"][group_key]:
                        raise ValueError(f"group '{group_key}' has no '{item}' field (required)#400")

                    # 2.2.2) all the sub fields need to be upper()
                    for sub_item in data["groups"][group_key][item]:
                        if sub_item.upper() != sub_item:
                            raise ValueError(f"'{sub_item}' inside '{item}' needs to be in UPPERCASE#400")

            # 3) group reference
            for group_key in data["groups"]:
                group_data = data["groups"][group_key]
                groups_included = group_data["includes_groups"]
                if groups_included :
                    for sub_key in groups_included :
                        try:
                            reference_group = data["groups"][sub_key]
                        except:
                            raise ValueError(f"referenced group '{sub_key}' doesn't even exist #400")

                        if reference_group["includes_groups"]:
                            raise ValueError("currently doesn't support more than 1 level of depth of group reference#400")

        # 0) fetch old coins
        coins = self.return_global_by_global_id("coin_list", "global_coins_dict")
        coin_groups = self.return_global_by_global_id("coin_groups")

        # 1) throw! if appropriate!
        try:
            validate()
        except ValueError as e:
            text, status_raw = str(e).split("#")
            status = int(status_raw)
            return text, status

        # 2) return 'success'
        if data == coin_groups:
            return "not modified tho'", 200
        else:
            query = {"global_id": "coin_groups"}

            # _) update it up
            db_h.update_entry(query, data, "api", "globals", upsert=True)

            # 2.1) fix unset
            unset_dict = {}
            for field in coin_groups:
                if field not in data:
                    unset_dict[field] = ""

            if unset_dict:
                db_h.unset_entry_fields(query, unset_dict, "api", "globals")

        return "modified", 200

    @staticmethod
    def return_global_by_global_id(global_id, inner=False):
        """ get global coins
        """
        # 1) fetch
        query = {"global_id": global_id}
        rv = db_h.get_entry("api", "globals", query)
        if rv:
            # 2) trim
            # 2.1) remove the 'global_id'
            del rv["global_id"]

            # 2.2) trim to inner if appropriate
            if inner:
                return rv["global_coins_dict"]
            else:
                return rv

        # 3) or return blankdict {}
        else:
            return {}


cg_logic = CGLogic()
