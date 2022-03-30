from multifarm_api import config as cf
import json

# # # # # # # # # # # # # # #
# TEMP. DOCS ENDPOINT       #
ACTIVE_FILTER = {
    "active": {
        "values": ["true", "false", "all"],
        "default": "true"
    }
}


TEMP_ENDPOINT_DATA_BASE = {
    "disclaimer": (
        "mostly hard-coded by hand 9th July 2021 rather than dynamically displaying filters"
        "fields with '?' at the start are actual query string args, sorts and filters"),
    "mode_filter": {
        "farms": {
            "?active": ACTIVE_FILTER
        },
        "assets": {
            "?active": ACTIVE_FILTER
        }
    },
    "min_max_filters": {
        "farms": {
            "tvlStaked": {
                "min": "?tvl_min",
                "max": "?tvl_max"
            },
            "tvlChange24hValue": {
                "min": "?tvl_change_min",
                "max": "?tvl_change_max"
            }
        },
        "assets": {
            "tvlStaked": {
                "min": "?tvl_min",
                "max": "?tvl_max"
            },
            "tvlChange24hValue": {
                "min": "?tvl_change_min",
                "max": "?tvl_change_max"
            },
            "aprYearly": {
                "min": "?apr_yearly_min",
                "max": "?apr_yearly_max"
            }
        }
    },
    "match_or_combo_filters": {
        "farms": [
            "?blockchain"
        ],
        "assets": [
            "?blockchain", "?farm_ids", "?yield_types", "?categories", "?exchanges"
        ]
    },
    "available_sorts": cf.ALLOWED_SORTS,
    "default_sort": cf.DEFAULT_SORT,
    "?sort_order": ["asc", "desc"],
    "sort_order_default": "asc",
    "?search": {
        "farms": {"matches": "farmName"},
        "assets": {"matches": "asset"}
    },
    "special_returned_fields": {
        "?search": {
            "name": "colorizedHtml",
            "purpose": "maybe with CSS added would make search match look better"
        }
    }
}


def run():
    with open("temp_docs.json", "w") as f:
        f.write(json.dumps(TEMP_ENDPOINT_DATA_BASE, indent=4))
        print("dumped")
