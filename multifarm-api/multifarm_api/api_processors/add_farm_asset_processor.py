from typing import Dict, Any

from multifarm_api.db_handles import db_handles as db_h
from multifarm_api.inner_api_logic.scraper_push_handles import scraper_push_handles
from multifarm_api.utils import utils as ut


class AddNewFarmAssetProcessor:

    def add_data(self, data: Dict[str, Any]) -> bool:
        formatted_data = {key: val["value"] for key, val in data.items()}
        if formatted_data.get("farmName"):
            return self.add_new_farm(formatted_data)
        if formatted_data.get("asset"):
            return self.add_new_asset(formatted_data)
        return False

    @staticmethod
    def add_new_farm(farm_data: Dict[str, Any]) -> bool:
        # set fields manually as they are not required in CMS
        map_fields: Dict[str, Any] = {"tvlFarm": 0,
                                      "scam": False,
                                      "scamInfo": None
                                      }
        for field in map_fields:
            if field not in farm_data:
                farm_data[field] = map_fields[field]
        entry = scraper_push_handles.create_farm_insert_entry(farm_id=farm_data["farmName"], data=farm_data,
                                                              status="success", update=False, delta_days=0)
        db_h.insert_entry(entry, "api", "farms")
        return True

    @classmethod
    def add_new_asset(cls, asset_data: Dict[str, Any]) -> bool:
        asset_data["dateAdded"] = asset_data.get("dateAdded", ut.get_utctime())
        asset_data["dateUpdated"] = asset_data.get("dateUpdated", ut.get_utctime())
        asset_data["assetId"] = f"{asset_data['farmId']}_{asset_data['exchangeName']}_{asset_data['asset']}"
        db_h.insert_entry(asset_data, "api", "assets")
        return True


farm_asset_processor = AddNewFarmAssetProcessor()
