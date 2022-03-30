import copy
import logging
from multifarm_api.db_handles import db_handles as db_h
from multifarm_api.utils import utils as ut


class Hotfixes: # TODO: REFACTOR

    @staticmethod
    def combine_current_and_old(current_assets, old_assets):
        """ combine current_assets with old_assets

            [WARNING] should be used after old normal thing has added 'to-disable' assets,
            because these will prevent outdated assets not appearing in new ones to falsely
            contributing to TVL calc.
        """
        # 0) copy to not modify
        copied_current_assets = copy.copy(current_assets)

        # 1) make new assets dictionary
        new_assets_dict = {}
        if isinstance(copied_current_assets, dict):
            copied_current_assets = [copied_current_assets]
        for asset in copied_current_assets:
            assetId = asset["assetId"]
            new_assets_dict[assetId] = None

        # 2) append old assets dictionary
        for asset in old_assets:
            assetId = asset["assetId"]
            if assetId not in new_assets_dict:
                copied_current_assets.append(asset)

        # 3) bad dict and final re-filtering
        bad_dict = {}
        for asset in old_assets:
            assetId = asset["assetId"]
            active = asset["active"]
            if not active and "_locks" in asset:
                if "active" in asset["_locks"]:
                    bad_dict[assetId] = None

        # 4) re-filter
        copied_current_assets_final = []
        for asset in copied_current_assets:
            assetId = asset["assetId"]
            if assetId not in bad_dict:
                copied_current_assets_final.append(asset)

        # 5) yield
        return copied_current_assets_final

    @staticmethod
    def provide_makeshift_tvl_single(farm_id):
        """ just added farms with current (2021.09.23 add / update API)...

            basically gives 1-point tvl of today as a 'fake' tvlValue
        """
        # 1) find and calculate up tvlAssets
        farms_tvl = 0
        farm_assets = db_h.get_entries("api", "assets", {"farmId": farm_id, "active": True}, them_all=True)
        for asset in farm_assets:
            try:
                farms_tvl += asset["tvlStaked"]
            except:
                if "assetId" in asset:
                    assetId = asset["assetId"]
                else:
                    assetId = "<not-found>"

                logging.error(f"[provide_makeshift_tvl_single()] for '{farm_id}' asset '{assetId }' failed to extract tvlStaked from asset")

        current_simple_time = ut.get_utctime(simple=True, delta_days=0)
        return [{"date": current_simple_time, "value": farms_tvl}]


hotfixes = Hotfixes()
