import datetime
import os
from urllib.parse import quote


class Config:

    MONGO_HOST = os.getenv("MONGO_HOST")
    MONGO_USER = quote(os.getenv("MONGO_USER"))
    MONGO_PASS = quote(os.getenv("MONGO_PASS"))

    #############################
    # DB RESET HOTFIX           #
    RESET_IN_UPDATE_MODE = False

    #############################
    # CONTROL                   #
    AUTOCALC_TOP_GRAPH = True
    AUTOCALC_TOP_GRAPH_FARM_IDS = {
        "BSC_Pancake": None,
        "ETH_Convex": None,
        "xDAI_Bao": None,
        "AVAX_Pefi": None,
        "AVAX_Yeti": None,
        "FANTOM_Spooky": None,
        "KUCOIN_Kudex": None,
    }


    #############################
    # FOR UTILS TO WORK         #
    DEBUG = True


    #############################
    # DIRS                      #

    # 1) TEMP DIRS
    JSON_DIR = "json_debug"

    # 2) SEMI-PERSISTENT-DIRS
    DB_DUMP_DIR = "db_dumps"

    # 2) PERSISTENT DIRS
    # 2.1) TESTING DATA DIRS (sub dirs in .\testing\testing_config )
    TESTING_DIR_BASE = "testing"

    # 3) FOR TEMP-DIR RE-INIT
    DIRECTORIES_USED = [JSON_DIR, DB_DUMP_DIR]


    #############################
    # DATABASE                  #
    DB_NAME = "GMMS_API"

    # # # # # # # # # # # # # # #
    # LOGINS UPLOAD             #
    LOGINS_FILENAME = "logins.json"
    LOGINS_COLLECTION = "logins"

    #############################
    # API                       #
    SECRET_URL_BASE = "jay_flamingo_random_6ix_vegas"

    PRETTIFY_OUT_JSON = False
    ONLY_SHOW_ACTIVE = True
    PAGINATION_PER_PAGE = 50  # [MONKEYPATCH] changing dynamically in full admin farm, full admin asset gets
    PAGINATION_PER_PAGE_DEFAULT = 50

    #############################
    # API DATA PROJECTION       #


    # # # # # # # # # # # # # # #
    # SORT FUNCTIONALITY        #
    DEFAULT_SORT = ("tvlStaked", -1)

    ALLOWED_SORTS = {
        "farm": ["farmName", "dateAdded", "blockchain", "tvlStaked", "tvlChange24hValue"],
        "asset": ["asset", "dateAdded", "tvlStaked", "tvlChange24hValue", "aprYearly", "blockchain", "farm", "rewardTokenA"]
    }

    # # # # # # # # # # # # # # #
    # SEARCH FUNCTIONALITY      #
    MAX_SEARCH_NUM_CHARS = 50

    SEARCH_FIELDS = {
        "farms": "farmName",
        "assets": "asset"
    }

    # asset combo filters, support comma-separated-many, key = in query string, value = in data
    ASSET_COMBO_FILTERS = {
        "farm_ids": "farmId",
        "yield_types": "yieldType",
        "categories": "category",
        "exchanges": "exchangeName",
    }

    # # # # # # # # # # # # # # #
    # CENSORSHIP & NULL FIELDS  #

    # ATM, cumulative
    FIELDS_HIDDEN_FROM_USER = [
        "[debug]_#th_entry",
        "[debug]_url",
        "lastFullUpdate",
        "_locks"
    ]

    # convert '""' and 'n/a' to None (null)
    CONVERT_TO_NULL = True


    #############################
    # API DATA-ENTRY-LOGIC      #
    FORCE_FIELDS_TO_MATCH = True

    #############################
    # DATA ENTRY                #
    VARIED_NAME = "<varies>"

    # # # # # # # # # # # # # # #
    # DATA ENTRY DEBUG          #
    LOG_INTERACTION = False

    #############################
    # API SCRAPING LOGIC        #
    MAX_ASSET_AGE = datetime.timedelta(days=3)
    SET_TVL_FIELDS_ON_DEACTIVATE = True


    #############################
    # CONVENTIONS               #
    # Statuses
    STATUSES_DICT = {
        "failed": False,
        "partial": False,
        "success": True
    }

    DEFAULT_SCRAPE_SOURCE = "vfat"

    # Simple Date Format
    SIMPLE_DATE_FORMAT = "%Y.%m.%d"

    CHAIN_ORDER = {
        "ALL": 0,
        "ETH": 1,
        "BSC": 2,
        "HECO": 3,
        "POLYGON": 4,
        "xDAI": 5,
        "AVAX": 6,
        "FANTOM": 7,
        "HARMONY": 8,
        "FUSE": 9,
        "THUNDERCORE": 10,
        "OKEX": 11,
        "KUCOIN": 12
    }

    # # # # # # # # # # # # # # #
    # CONVENTIONS (THEORY)      #
    FARM_FIELDS = {
        # NORMAL FIELDS
        "farmId": "",
        "dateAdded": None,
        "dateUpdated": None,  # triggers on all states: ['success', 'partial', 'fail'] / FAIL counts and sets actives
        # ADDITIONAL FIELDS - added on find farm by id
        "numActiveAssets": None,
        "numInactiveAssets": None,
        "numTotalAssets": None,
        "tvlHistory": [],
        # ADMIN FIELDS - planned, currently not adding for simplicity
        "lastFullUpdate": None,  # triggers only on 'success' - only needed for FARMS
    }


config = Config()
