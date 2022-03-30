""" simply tests some base areas of the API to work correctly
"""
# std. lib
import os
import sys
import json
import copy
import random
import unittest

# pip packages
import requests

# user 'global' modules

# user 'more local' modules
import multifarm_api.inner_api_logic.backup_db as b_db
from multifarm_api import inner_api_logic as l_ut, testing as t_cf, config as cf, db_handles as db_h, utils as ut

# local
import multifarm_api.testing.request_data.requests_data as rd

# local config


#############################
# SETUP                     #

class DatabaseAPISetup:
    """ Setup DB, check if API is running.
        I intend this to be run 1x at the start of testing.
    """
    @staticmethod
    def check_if_api_running():
        """ check if the API is running, if not, display error
        """
        url = t_cf.API_WELCOME_URL
        try:
            r = requests.get(url)
            if r.status_code != 200:
                sys.exit(f"API returns non-200 status code '{r.status_code}' on {url}")

        except requests.exceptions.ConnectionError:
            sys.exit(f"API is down on '{url}', please start API before testing")


#############################
# TEST SETS:                #

#############################
# API                       #


class SetUpClassSetups:
    @staticmethod
    def say_hello():
        print("SetUpClassSetups says hello!")

S_U_C_S = SetUpClassSetups()


class TestAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """ setup for testing the API
        """
        # 1) check if API is running
        DatabaseAPISetup.check_if_api_running()

        # 2) save the db as a backup
        b_db.make_db_backup(t_cf.TEMP_BACKUP_NAME, single_chain=t_cf.SINGLE_CHAIN)

        # 3) reset the db
        if t_cf.SINGLE_CHAIN:
            print("loading in single chain backup...")
            b_db.load_db_backup(t_cf.TESTING_DB_AVAX_BASE_DUMP, full_path=True, single_chain="AVAX")
        else:
            print("loading in full backup...")
            b_db.load_db_backup(t_cf.TESTING_DB_BASE_DUMP, True)

        # 4) add those new logins (update if it has same login already)
        db_h.update_entries("username", t_cf.DEMO_LOGINS_LIST, "api", "logins", upsert=True)

        # _) acknowledge
        print("[start] SetupClass has been run")


    @classmethod
    def tearDownClass(cls):
        """ reset the database,
            clean stuff up
        """
        # print to avoid .<next_text>
        print()

        # 1) delete unwanted entries
        db_h.delete_entries_2("username", t_cf.DEMO_LOGINS_LIST, "api", "logins")

        # 2) reset the db back
        b_db.load_db_backup(t_cf.TEMP_BACKUP_NAME)

        # 3) delete any temporary files
        if t_cf.SINGLE_CHAIN:
            remove_path = f"{cf.DB_DUMP_DIR}{os.sep}{t_cf.TEMP_BACKUP_NAME}_{t_cf.SINGLE_CHAIN}.json"
        else:
            remove_path = f"{cf.DB_DUMP_DIR}{os.sep}{t_cf.TEMP_BACKUP_NAME}.json"

        os.remove(remove_path)
        print(f"removed {remove_path} temporary file")

        # _) acknowledge
        print('\n[end] TearDownClass has been run.\n')


    # 1) ABCs
    def test_hello_world(self):
        r = requests.get(t_cf.API_WELCOME_URL)

        # test status code
        self.assertEqual(r.status_code, 200)

    # 2) 3rd Sept _locks bug
    def test_locks_bug_avax_olive(self):
        # 0) unpack stuff from config
        de_user = t_cf.users["data_entry_user"]
        auth = de_user["username"], de_user["password"]
        pl_1 = rd.test_locks_bug_avax_olive_set_lock["PAYLOAD_1"]
        pl_2 = rd.test_locks_bug_avax_olive_set_lock["PAYLOAD_2"]

        # 0.1) set fn-scope config
        oo_assetId = "AVAX_Olive___OLIVE"

        # 0.1) delete
        db_h.delete_entry({"assetId": oo_assetId}, "api", "assets")

        # 1) post first one
        r1 = requests.post(f"{t_cf.API_FULL_BASE}/d33p_secret_scraper_pushes_farm", json=pl_2)
        self.assertEqual(r1.status_code, 200)

        ooaa_r1 = db_h.get_entry("api", "assets", {"assetId": oo_assetId})
        self.assertEqual(ooaa_r1["_locks"], [])
        self.assertEqual(ooaa_r1["active"], True)

        # 2) edit _locks
        r2 = requests.put(f"{t_cf.API_FULL_BASE}/edit", json=pl_1, auth=auth)
        self.assertEqual(r2.status_code, 200, "admin edit post request receives as 200")

        # olive_olive_asset_after
        ooaa_r2 = db_h.get_entry("api", "assets", {"assetId": oo_assetId})
        self.assertEqual(ooaa_r2["_locks"], ["active"])
        self.assertEqual(ooaa_r2["active"], False)

        # 3) push in value
        r3 = requests.post(f"{t_cf.API_FULL_BASE}/d33p_secret_scraper_pushes_farm", json=pl_2)
        self.assertEqual(r3.status_code, 200)

        ooaa_r3 = db_h.get_entry("api", "assets", {"assetId": oo_assetId})
        self.assertEqual(ooaa_r3["_locks"], ["active"])
        self.assertEqual(ooaa_r3["active"], False)

        # 4) remove the lock

        # 5) push again (active should go to True)

    # 3) 19th Sept - KuCOIN asie bug
    def test_kucoin_asie(self):
        """ [NOTES]

            First of, is unfinished and possibly useless. Anyhow imo an okay example and maybe I finish it up
            later.

            TIME_DELTAS:
            "KUCOIN_Kudex___KUD": -4,
            "KUCOIN_Kudex___WKCS": -4,
            rest -2

            INITIAL_STATUSES:
            (Active: True)
            'KUCOIN_Kudex_Uniswap_WKCS-KUD': 'True'
            'KUCOIN_Kudex___KUD': 'True'
            'KUCOIN_Kudex___WKCS': 'True'
            'KUCOIN_Kudex_Uniswap_WKCS-KuDo': 'True'
            'KUCOIN_Kudex_Uniswap_USDT-WKCS': 'True'
            'KUCOIN_Kudex_Uniswap_WKCS-USDC': 'True'
            'KUCOIN_Kudex___USDC': 'True'
            'KUCOIN_Kudex_Uniswap_USDC-KUD': 'True'
            'KUCOIN_Kudex_Uniswap_KuKitty-KUD': 'True'
            'KUCOIN_Kudex_Uniswap_WKCS-BNB': 'True'
            'KUCOIN_Kudex_Uniswap_BNB-KUD': 'True'
            'KUCOIN_Kudex_Uniswap_KUD-DAI': 'True'
            'KUCOIN_Kudex_Uniswap_USDT-ETH': 'True'
            'KUCOIN_Kudex_Uniswap_USDT-WBTC': 'True'

            (Active: False)
            'KUCOIN_Kudex___KUDEX-LP': 'False'
            'KUCOIN_Kudex_Uniswap_WKCS-KFARM': 'False'
            'KUCOIN_Kudex___USDT': 'False'
            'KUCOIN_Kudex_Uniswap_USDT-KUD': 'False'
            'KUCOIN_Kudex_Uniswap_KUBEANS-KUD': 'False'
            'KUCOIN_Kudex_Uniswap_KUD-BUSD': 'False'

        """
        # 0) define inner fn(s)
        def set_datetimes():
            """ sets datetimes for 'kucoin_asie_failed'
            """
            # 1) pick timedeltas dictionary
            oad_s = kucoin_asie_failed['old_assets_deltas']
            oa_s = kucoin_asie_failed["old_assets"]

            # 2) set 'dateUpdated' to the correct one
            for asset in oa_s:
                assetId = asset["assetId"]
                if assetId in oad_s:
                    delta_days = oad_s[assetId]
                    asset["dateUpdated"] = ut.get_utctime(delta_days=delta_days)

        def check_list_contains(lst, key, lst_key_value, specific_field=None, specific_value="not_given", check_if_doesnt=False):
            """ [DEFAULT]
                check if a list contains or doesn't contain (ALL / NONE) of these items.
                default `mode = ALL`, set check_if_doesnt to True for `mode = NONE`.

                [EXTRA FUNCTIONALITY]
                check if a list contains or doesn't contain (ALL / NONE) of a specific field of, optional,
                specific value.

                [ON USAGE]
                if need to check just one item, set lst_key_value to [<value_item_1>] and that's it.
            """
            # 1) set count
            count = 0

            # 2) iterate and compute up the count
            for item in lst:
                value = item[key]

                # _) if True, we've found an item of the items we're to check
                if value in lst_key_value:
                    # 2.1) count up [DEFAULT]
                    if not specific_field:
                        count += 1

                    # 2.2) specific fields mode
                    elif specific_field in item:
                        # 2.2.1) [DEFAULT]
                        if specific_value == "not_given":
                            count += 1
                        # 2.2.2) specific value mode
                        else:
                            s_value = item[specific_field]
                            if s_value == specific_value:
                                count += 1

            # 3) return the results
            # 3.1) default (all match)
            if not check_if_doesnt:
                # _) yes
                if count == len(lst_key_value):
                    return True
                # _) no
                else:
                    return False
            # 3.2) alternative (none match)
            else:
                # _) yes, zero of them match
                if count == 0:
                    return True
                # _) no, at least one of them match
                else:
                    return False

        # 1) load in the static file
        with open(f"{t_cf.TESTING_OTHER_SAMPLE_DATA_DIR}{os.sep}kucoin_asie_failed.json") as f:
            kucoin_asie_failed = json.loads(f.read())

        # 2) set datetimes
        set_datetimes()

        # 3) tests = old assets get carried over
        # 3.0) unpack bases
        new_assets_base = kucoin_asie_failed["new_assets"]
        old_assets_base = kucoin_asie_failed["old_assets"]

        # 3.1) test all old assets are in if new status = failed & new_assets = []
        new_assets_copy = []
        old_assets_copy = copy.copy(old_assets_base)
        l_ut.append_set_inactive_entries(new_assets_copy, old_assets_copy, "partial")

        # TODO: finish later
        # # 3.2) test all old assets are in if new status = partial & new_assets = []
        # new_assets_copy = []
        # old_assets_copy = copy.copy(old_assets_base)
        # l_ut.append_set_inactive_entries(new_assets_copy, old_assets_copy, "partial")

#############################
# TOP-LEVEL RUN             #
def run():
    print("is called")
    unittest.main(module="testing.run_tests")


if __name__ == "__main__":
    run()