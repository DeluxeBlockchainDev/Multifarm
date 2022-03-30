import sys
import os
import json
import pathlib

""" JSON-like requests data
"""
stem = __file__.replace("requests_data.py", "")
json_dir = stem + "requests"


# 1)
test_locks_bug_avax_olive_set_lock = {
    "PAYLOAD_1": {
        "assetId": "AVAX_Olive___OLIVE",
        "fields": {
            "active": {
                "value": False,
                "locked": True
            }
        }
    },
    "PAYLOAD_2": None,  # full scraper-like farm push
    "PAYLOAD_3": {
        "assetId": "AVAX_Olive___OLIVE",
        "fields": {
            "active": {
                "value": False,
                "locked": False
            }
        }
    }
}


#############################
# PREFILL                   #
# P 1)
with open(f"{json_dir}{os.sep}avax_olive.json") as f:
    test_locks_bug_avax_olive_set_lock["PAYLOAD_2"] = json.loads(f.read())

