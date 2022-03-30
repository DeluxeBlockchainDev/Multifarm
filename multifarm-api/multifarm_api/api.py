import logging

from flask import Flask, request, redirect
from flask_cors import CORS

# user's modules
from multifarm_api.utils import utils as ut
from multifarm_api.db_handles import db_handles as db_h
from multifarm_api.api_handles import api_handles as api_h
from multifarm_api.hotfixes import hotfixes as hf
from multifarm_api.api_processors.add_farm_asset_processor import farm_asset_processor

# user's config
from multifarm_api.config import config as cf

# for auth
from flask_httpauth import HTTPBasicAuth
from werkzeug.security import check_password_hash
from multifarm_api.inner_api_logic.login_handles import login_handles as l_h

# logging TODO: test it
logging.basicConfig(filename="logs.log")

###########################
# INIT APP                #
application = Flask(__name__)
application.config['PROPAGATE_EXCEPTIONS'] = True
CORS(application)

#
# ###########################
# # Basic Auth              #
auth = HTTPBasicAuth()


@auth.verify_password
def verify_password(username, password):
    """ reused example of simple basic-auth
    """

    # 0) define inner fn(s)
    def check_password():
        """ return True if password matches
        """
        if check_password_hash(db_password, password):
            return True

    # 1) get matching entries
    entries = db_h.get_entries("api", cf.LOGINS_COLLECTION, {"username": username})
    # 1.1) and throw if no entries
    if not entries:
        return False

    # 2) get db entry and check it
    db_entry = entries[0]
    db_password = db_entry["password"]

    # 3) return username is login matches up
    if check_password():
        return username


#############################
# NON-ROUTE fn(s)           #
def init():
    """ any initialization that might be required
    """
    # 1) create temp directories if not present
    ut.init_directories()

    # 2) modify app settings
    application.config['JSON_SORT_KEYS'] = False

    # 3) modify app settings based on config
    if cf.PRETTIFY_OUT_JSON:
        application.config['JSONIFY_PRETTYPRINT_REGULAR'] = True

    # 4) log to understand how often GUNICORN RUNS THIS
    logging.warning("[INIT RUN DEBUG]")


#############################
# ROUTES                    #

#############################
# ADMIN-ISH ROUTES          #

#############################
# ROUTE FOR SCRAPERS        #
@application.route(f"/{cf.SECRET_URL_BASE}/d33p_secret_scraper_pushes_farm", methods=["POST"])
def receive_pushes():
    api_h.process_scraper_push(request.get_json())
    return "ok", 200


# # # # # # # # # # # # # # #
# CALCULATE TVL             #
@application.route(f"/{cf.SECRET_URL_BASE}/coconut_calculate_globals")
@auth.login_required()
def calculate_global_tvl():
    # 1) enforce lvl 2 access being required
    _ = l_h.require_user_level(auth.username())
    if _:
        return _

    # 2) execute normal logic
    api_h.calculate_global_tvls()
    api_h.calculate_global_multi_selects()
    return "calculated global tvl + global multi-selects", 200


#############################
# ADMIN DATABASE            #
@application.route(f"/{cf.SECRET_URL_BASE}/admin_database", methods=["POST"])
@auth.login_required()
def admin_database():
    """ admin database commands 'nuke', 'backup', 'reset' (a backup json), 'delete' (a backup json)
    """
    # 1) enforce lvl 2 access being required
    _ = l_h.require_user_level(auth.username())
    if _:
        return _

    # 2) normal logic
    resp, status = api_h.admin_database(request.get_json())
    return ut.jsonify(resp), status


#############################
# DATA ENTRY GUY ENDPOINTS  #
# 1) LOGIN
@application.route(f"/{cf.SECRET_URL_BASE}/login", methods=["GET", "POST"])
@auth.login_required
def login():
    """ confirm basic auth password works + give the user his `user_color`
    """
    return l_h.login(auth.username())


@application.route(f"/{cf.SECRET_URL_BASE}/add_farm", methods=["POST"])
@auth.login_required()
def add_farm():
    request_json = request.get_json()
    req_fields = request_json.get("fields")
    if not req_fields:
        return "Did not receive any fields", 400

    logging.info(request_json)
    must_have_fields = ["farmName", "blockchain", "active", "source"]
    missing_fields = [field for field in must_have_fields if field not in req_fields]
    if missing_fields:
        return f"These fields must exist in request: {missing_fields}", 400
    if farm_asset_processor.add_data(req_fields):
        return request_json, 201
    return f"farmName or asset was not found in {request_json}", 400


@application.route(f"/{cf.SECRET_URL_BASE}/add_asset", methods=["POST"])
@auth.login_required()
def add_asset():
    request_json = request.get_json()
    req_fields = request_json.get("fields")
    if not req_fields:
        return "Did not receive any fields", 400
    must_have_fields = ["farmId", "url", "blockchain", "exchangeName", "asset", "tokenA", "tokenB",
                        "tvlStaked", "aprYearly", "active", "source", "investmentLink", "stakingLink", "yieldType"]
    missing_fields = [field for field in must_have_fields if field not in req_fields]
    if missing_fields:
        return f"These fields must exist in request: {missing_fields}", 400
    logging.info(request_json)
    if farm_asset_processor.add_data(req_fields):
        return request_json, 201
    return f"farmName or asset was not found in {request_json}", 400


@application.route(f"/{cf.SECRET_URL_BASE}/edit", methods=["GET", "POST", "PUT"])
@auth.login_required
def edit():
    """ edit farms or assets endpoint
    """

    # 0) define inner fn()s
    def log_interaction(resp, status):
        """ log user's interaction with the API
        """
        # 1) throw
        if not cf.LOG_INTERACTION:
            return

        # 2) process
        try:
            data = request.get_json()
            if not isinstance(data, dict):
                raise ValueError("wrong")

            data["_d_username"] = auth.username()
            data["_d_time"] = ut.get_utctime()
        except:
            data = "wrong_data"

        # 3) log
        dump = {
            "data": data,
            "resp": resp,
            "status": status
        }
        ut.save_json(dump, "data_entry_user_interaction")

    # 1) Hello World Text
    if request.method == "GET":
        return "Use 'POST' to get data; 'DELETE' to delete (give 'farmId', 'assetId' or 'farmIds', 'assetIds'," \
               "'assetsByFarmId' fields), 'PUT' to edit!", 200

    # 2) POST requests = get the inner data with 'locks' and stuff
    if request.method == "POST":
        request_json = request.get_json()
        if "method" in request_json and request_json["method"] not in ["GET", "DELETE"]:
            return "needs valid 'method' = 'GET' or 'DELETE' 'method' field, yo!", 400

        if "method" in request_json:
            method = request_json["method"]

            # 2.1) process 'GET' requests
            if method == "GET":
                resp, status = api_h.edit_assets_or_farms_post_get(request.get_json())

            # 2.2) POST TBD TODO: TBD for to-be-done, les' make it later

            # 2.3) process 'DELETE' requests
            elif method == "DELETE":
                resp, status = api_h.edit_assets_or_farms_post_delete(request_json)

            log_interaction(resp, status)  # [DEBUG SPOT #1]
            return ut.jsonify(resp), status

    # 3) PUT requests = edit the stuff up
    if request.method == "PUT":
        resp, status = api_h.edit_assets_or_farms_put(request.get_json())
        log_interaction(resp, status)  # [DEBUG SPOT #2]
        return ut.jsonify(resp), status


# X) EDIT GLOBAL TEXT
@application.route(f"/{cf.SECRET_URL_BASE}/edit_globals", methods=["GET", "PUT"])
@auth.login_required
def edit_globals():
    """ edit global variables
    """
    resp, status = api_h.edit_globals(request)
    return ut.jsonify(resp), status


#############################
# SECRET USER DUMPS         #

# 1) FARMS (for DUMPS)
@application.route(f"/{cf.SECRET_URL_BASE}/secret_4442135_get_farms")
@auth.login_required
def get_all_farms():
    """ get all farms, for dumps
    """
    # 1) enforce lvl 2 access being required
    _ = l_h.require_user_level(auth.username())
    if _:
        return _

    # 2) normal logic
    all_data = api_h.admin_get_farms()
    return ut.jsonify(all_data), 200


# 2) ASSETS (for DUMPS)
@application.route(f"/{cf.SECRET_URL_BASE}/secret_4442135_get_assets")
@auth.login_required
def get_all_assets():
    """ get all assets, for dumps
    """
    # 1) enforce lvl 2 access being required
    _ = l_h.require_user_level(auth.username())
    if _:
        return _

    # 2) normal logic
    all_data = api_h.admin_get_assets()
    return ut.jsonify(all_data), 200


#############################
#  USER ROUTES              #

# # # # # # # # # # # # # # #
# 1) DISPLAY FARMS          #
@application.route(f"/{cf.SECRET_URL_BASE}/get_farms")
def get_farms():
    """ 'get farms' - one of two primary endpoints,
        other being - 'get assets'
    """
    resp, status = api_h.get_farms()
    ut.censor_resp_to_users(resp, ["lastFullUpdate", "tvlHistory"])
    return ut.jsonify(resp), status


@application.route(f"/{cf.SECRET_URL_BASE}/get_farm_details/<farm_id>")
def get_farm_details(farm_id):
    """ get full details for a farm
    """
    # 1) get the data
    farm_to_return = api_h.get_farm(farm_id)
    if farm_to_return:
        # 1.1) also provide 2021.09.23 hotfix for potential half-added farm which doesn't have 'tvlStakedHistory' yet
        if "tvlStakedHistory" not in farm_to_return:
            try:
                farmId = farm_to_return["farmId"]
                farm_to_return["tvlStakedHistory"] = hf.provide_makeshift_tvl_single(farmId)
            except:
                pass

        resp, status = farm_to_return, 200
    else:
        resp, status = f"farm '{farm_id}' not found on the base", 404

    # 2) return the data
    ut.censor_resp_to_users(resp)
    return ut.jsonify(resp), status


# # # # # # # # # # # # # # #
# 2) DISPLAY ASSETS         #
@application.route(f"/{cf.SECRET_URL_BASE}/get_assets")
def get_assets():
    """ 'get assets' = one of two primary endpoints,
        other being - 'get farms'
    """
    resp, status = api_h.get_assets()
    ut.censor_resp_to_users(resp, ["aprHistory", "tvlStakedHistory", "rewardTokenPriceHistory"])
    return ut.jsonify(resp), status


# TODO: LEGACY ENDPOINT, REMOVE IT LATER
@application.route(f"/{cf.SECRET_URL_BASE}/get_assets_by_farm_id/<farm_id>")
def get_assets_by_farm_id(farm_id):
    if farm_id:
        data = api_h.get_assets_by_farm_id(farm_id)
        resp, status = data, 200
    else:
        resp, status = "not a valid 'farmId' specified yo?", 400

    ut.censor_resp_to_users(resp)
    return ut.jsonify(resp), status


# #) get_asset_details
@application.route(f"/{cf.SECRET_URL_BASE}/get_asset_details/<asset_id>")
def get_asset_details(asset_id):
    """ inner endpoint for asset details
    """
    resp, status = api_h.get_asset_details(asset_id)
    return ut.jsonify(resp), status


# # # # # # # # # # # # # # #
# 3) GLOBALS / GRAPHS       #
@application.route(f"/{cf.SECRET_URL_BASE}/get_all_blockchain_30d_tvl_graph")
def get_all_blockchain_30d_tvl_graph():
    """ get the top 30d TVL graph
    """
    data, status = api_h.get_global_30d_graph_tvls()
    return ut.jsonify(data), status


@application.route(f"/{cf.SECRET_URL_BASE}/get_global_multi_selects", methods=['GET', 'OPTIONS'])
def get_global_multi_selects():
    """ get the global multi-selects
    """
    data, status = api_h.get_global_selects()
    return ut.jsonify(data), status


@application.route(f"/{cf.SECRET_URL_BASE}/get_global_multi_selects_temporary", methods=['GET', 'OPTIONS'])
def get_global_multi_selects_temp():
    """ [TEMP] get the global multi-selects
    """
    data, status = api_h.get_global_selects(farms=False)
    return ut.jsonify(data), status


@application.route(f"/{cf.SECRET_URL_BASE}/get_global_farms_list", methods=['GET', 'OPTIONS'])
def get_global_multi_selects_farms_only():
    """ get the global farms-only
    """
    data, status = api_h.get_global_selects(farms="solo")
    return ut.jsonify(data), status


#  #  #  #  #   #  #  #  #  #
# 3.1) Recalculate Them     #
@application.route(f"/{cf.SECRET_URL_BASE}/recalculate_global_coins")
@auth.login_required()
def recalculate_global_coins():
    """ recalculate global coins
    """
    data = api_h.calculate_global_coins()
    return ut.jsonify(data), 200


# 3.2) Coin Group Filters
@application.route(f"/{cf.SECRET_URL_BASE}/get_coins_and_coin_groups")
def get_coins_and_coin_groups():
    """ get coins and coin-groups
    """
    data = api_h.return_global_coins()
    return ut.jsonify(data), 200


# 3.3) API Edit Coin Group Filters
@application.route(f"/{cf.SECRET_URL_BASE}/edit_coin_group_filters", methods=["PUT"])
@auth.login_required()
def edit_coin_group_filters():
    """ edit coin-group filters
    """
    resp, status = api_h.edit_coin_group_filters(request.get_json())
    return ut.jsonify(resp), status


#############################
# DUMMY WELCOME PAGE        #
@application.route("/")
def hello_world():
    return redirect("https://www.multifarm.fi/", code=302)
