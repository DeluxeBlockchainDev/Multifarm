""" utils.py: utility fn(s) and helpers
"""
# std-lib
import os
import sys
import json
import datetime
import time
import re
import logging

from pathlib import Path
from flask import request
from flask import jsonify as flask_jsonify

# non std-lib
import pyperclip

# new [new structure]
from multifarm_api.coin_group_filters.cg_logic import cg_logic

# user libs and modules
from multifarm_api.config import config as cf


class Utils:
    G = {
        "start": datetime.datetime.now()
    }

    #############################
    # TEMP. HELPERS             #
    @staticmethod
    def unpack_coin(coin_dict, coins, searched_coin_raw):
        """ unpack coin(s)
        """

        # 0) define inner fn(s)
        def compile_real_coin_list(raw_list):
            """ I think there's not need to trim into set because groups unpack already trims it
            """
            real_coins = []
            for coin in raw_list:
                try:
                    real_coins += coins[coin]["names"]
                except:
                    logging.warning(f"coin '{coin}' got to compile_real_coin_list() but is not in coins, skipping...")

            return real_coins

        # 1) transform to uppercase
        searched_coin = searched_coin_raw.upper()

        # 2.1) searched_coin is a group
        groups = coin_dict["groups"]
        if searched_coin in groups:
            group = groups[searched_coin]
            raw = group["includes_coins"]
            if group["includes_groups"]:
                for sub_group in group["includes_groups"]:
                    ref_group = groups[sub_group]
                    raw += ref_group["includes_coins"]

            rv_raw = list(set(raw))

        # 2.2) searched_coin in a coin
        elif searched_coin in coins:
            rv_raw = [searched_coin]

        # 2.3) searched_coin is not found, gets thrown later
        else:
            rv_raw = False

        # 4) not found (throw)
        if not rv_raw:
            raise ValueError(f"'{searched_coin}' is not a coin or coin_group#400")

        # 5) process and return
        return compile_real_coin_list(rv_raw)

    #############################
    # HELPERS                   #
    @staticmethod
    def crash():
        """ crash the script if 'y' is pressed
        """
        if input("Press 'y' to crash!: ") == "y":
            sys.exit(0)

    @staticmethod
    def dollar_to_float(dollar_string):
        """ turns dollar amount, stripped, with $ in it to float, rounded to 2
        """
        if "$" not in dollar_string:
            raise ValueError("dollar_to_float() wrong input '{}'".format(dollar_string))

        raw = dollar_string.replace("$", "").replace(",", "")
        raw_float = float(raw)
        return round(raw_float, 2)

    #############################
    # WORKING W/ DIRECTORIES    #
    @staticmethod
    def make_dir_if_not_present(directory):
        """ make directory if it's not present, returns True if it made it
        """
        if not os.path.isdir(directory):
            os.mkdir(directory)
            return True

    @staticmethod
    def clean_directory(root_dir):
        """ deletes top level files from a directory
            [WARN] doesn't delete inner directories
        """
        # 1) delete non-directory inner paths
        kills = 0
        p = Path(root_dir)
        for item in p.iterdir():
            if not item.is_dir():
                os.remove(str(item))
                kills += 1

        # 2) print some info if made 1 or more deletes
        if kills > 0:
            print(f"[ut.clean_directory()] deleted #{kills} items from '{root_dir}'")

    def init_directories(self):
        """ creates a cf.DIRECTORIES_USED' directories if any of them doesn't exist.
            An anti - .gitkeep, anti - .gitignore solution!
        """
        for directory in cf.DIRECTORIES_USED:
            if self.make_dir_if_not_present(directory):
                print("[init_directories()] created a folder called '{}'".format(directory))

    #############################
    # TIME, DATE, TIMEDELTA     #
    def get_elapsed(self):
        """ get time elapsed
        """
        now = datetime.datetime.now()
        return now - self.G["start"]

    @staticmethod
    def time_it(func):
        """ the essentials - a time-it function to use as a decorator
        """

        # f short for 'function'
        def f(*args, **kwargs):
            start = datetime.datetime.now()
            # rv short for 'return_value'
            rv = func(*args, **kwargs)
            time_delta = datetime.datetime.now() - start
            print('^ "{}()" took {} to complete\n'.format(func.__name__, time_delta))
            return rv

        return f

    @staticmethod
    def get_ts(as_str=False):
        """ get current timestamp
        """
        # 'ts' for 'timestamp' - we'll use milliseconds for this example
        ts = int(time.time() * 1000)
        if as_str:
            ts = str(ts)

        return ts

    @staticmethod
    def get_utctime(simple=False, delta_days=0):
        """ get timezone-aware UTC-time
        """
        # 0) get current datetime + apply timedelta
        now = datetime.datetime.now(datetime.timezone.utc)
        delta = datetime.timedelta(days=delta_days)
        now += delta

        # A) return full utc-iso-format time string
        if not simple:
            # [note:] I'm using the full datetime module format
            return now.isoformat()

        # B) return a simpler YYYY-MM-DD format instead
        return now.strftime(cf.SIMPLE_DATE_FORMAT)

    @staticmethod
    def read_day_time(time_string):
        """ return date based of time_string
        """
        return datetime.datetime.strptime(time_string, cf.SIMPLE_DATE_FORMAT)

    #############################
    # WORKING WITH JSON         #
    def save_json(self, data, title):
        """ helper to save 'pretty' JSON
        """
        filename = cf.JSON_DIR + os.sep + "{}_{}.json".format(title, self.get_ts())

        with open(filename, "w", encoding="utf-8") as f:
            f.write(json.dumps(data, indent=4))
            if cf.DEBUG:
                print("[save_json()] wrote 4-indented JSON to '{}'".format(filename))

    @staticmethod
    def c2c_json(data):
        """ copies indent=4 json to clipboard
        """
        json_str = json.dumps(data, indent=4)
        pyperclip.copy(json_str)
        print("[c2c_json()] copied data as json-4 to clipboard!")

    @staticmethod
    def remove_debug_fields(dictionary):
        """ returns a copy of a dict with debug fields removed
        """
        # 1) consider fields containing this to be 'debug' fields
        debug_fields = ["[debug]", "[DIVIDER]"]

        # 2) copy the dict
        copy = dict(dictionary)

        # 3) remove 'debug' fields from the copy
        for field in dictionary.keys():
            for d_field in debug_fields:
                if d_field in field:
                    del copy[field]
                    break

        # 4) return the copy
        return copy

    @staticmethod
    def reduce_list_of_dict_fields(lst_of_dict, lst_fields_to_rm, sub_key=False):
        """ deletes given fields from a lst_of_dict
            [WARNING] probably messes up the keys
        """
        # 1) init new list of dict
        new_lst_of_dict = []

        # 2) iterate A. normally:
        if not sub_key:
            for entry in lst_of_dict:
                for field in lst_fields_to_rm:
                    try:
                        del entry[field]
                    except KeyError:
                        pass  # KeyError = no key = perfect

                new_lst_of_dict.append(entry)

            return new_lst_of_dict

        # 2) iterate B. 'sub_key_mode'
        for entry in lst_of_dict:
            base = dict(entry)
            new_sub_entries = []
            for sub_entry in entry[sub_key]:
                for field in lst_fields_to_rm:
                    try:
                        del sub_entry[field]
                    except KeyError:
                        pass  # KeyError = no key = perfect

                new_sub_entries.append(sub_entry)

            base[sub_key] = new_sub_entries
            new_lst_of_dict.append(base)

        # 3) return
        return new_lst_of_dict

    @staticmethod
    def strip_all(dictionary):
        """ strip all string key values on a dict
        """
        for a_key in dictionary:
            value = dictionary[a_key]
            if isinstance(value, str):
                dictionary[a_key] = value.strip()

    #############################
    # WORKING WITH DICTS        #
    @staticmethod
    def add_more_fields_inner(dict1, dict2, rewrite):
        """ merges two dictionaries
        """
        # 1) iterate over dict 2 keys
        for key in dict2:
            # 2) check if those keys are in dict 1
            if key in dict1:
                if rewrite:  # 2A) if force-rewrite, force them over, doesn't matter
                    # print("[WARN!] force rewrote '{}' within dict1 + dict2!".format(key))
                    dict1[key] = dict2[key]
                else:  # 2B) if not force-rewrite, warn and skip
                    print("[WARN!] adding '{}' to entry would rewrite the key. Not written.".format(key))
            else:
                dict1[key] = dict2[key]  # 3) if keys are unique, always write them to dict1

    def add_more_fields(self, dict1, additions, rewrite=False):
        """ add more fields to a dictionary entry
        """
        # 1) additions is a dict
        if isinstance(additions, dict):
            self.add_more_fields_inner(dict1, additions, rewrite)
            return

        # 2) additions is a list
        if isinstance(additions, list):
            for dictionary in additions:
                self.add_more_fields_inner(dict1, dictionary, rewrite)
                return

        # wrong type
        raise ValueError(f"additions of wrong type '{type(additions)}'; only 'list' and 'dict' are supported!")

    @staticmethod
    def remove_fields(dict_1):
        """ remove junk
        """
        junk = ["[DIVIDER]", "[DIVIDER_#]"]
        for jnk in junk:
            if jnk in dict_1:
                del dict_1[jnk]

    @staticmethod
    def pretty_print_dict(dictionary, end_newline=True):
        """ helper to pretty print a dict
        """
        # 1) pretty print a dictionary
        for a_key in dictionary:
            value = dictionary[a_key]
            print(f"\t{a_key}: '{value}'")

        # 2) add a newline if specified
        if end_newline:
            print()

    # # # # # # # # # # # # # # #
    # & SORT FANCY              #
    @staticmethod
    def reorder_a_key_after(dictionary, key_b4, key_after):
        """ reorders a key after
        """
        # 1) raise value-error if both keys are not present
        if not (key_b4 in dictionary and key_after in dictionary):
            raise ValueError(f"both '{key_b4}' and '{key_after}' not in dictionary")

        # 2) unpack keys except key after
        BASE_KEYS = []
        for key in dictionary:
            if key != key_after:
                BASE_KEYS.append(key)

        # 3) insert 'key_after' just after 'key_b4' (at index_of + 1)
        BASE_KEYS.insert(BASE_KEYS.index(key_b4) + 1, key_after)

        # 4) repack together a new dict
        new_dict = dict()
        for key in BASE_KEYS:
            new_dict[key] = dictionary[key]

        # 5) return the result
        return new_dict

    # # # # # # # # # # # # # # #
    # MATCH LIST OF DICT        #
    @staticmethod
    def pick_matching_entries(lst_of_dict, matches):
        """ pick matching entries from lst of dict
            lst_of_dict = list of dict
            matches = shorter list of dict with keys to 100% match up

            if doesn't match any; raises error
        """

        # 0) define inner FN(s)
        # [innermost fn]
        def check_if_entry_does_match(entry, match):
            """ check if match matches an entry
            """
            # 1) raise the match if it's invalid
            if match == {} or not isinstance(match, dict):
                raise ValueError(f"'{match}' is an invalid dict to match")

            # 2) return 'false' if any key doesn't match
            for a_key in match:
                if not entry[a_key] == match[a_key]:
                    return False

            # 3) return 'true' (if it got here; it matches)
            return True

        # [inner fn]
        def get_matching_item(full_entries, match):
            """ returns a copy of an entry if it matches the match;
                else raise ValueError

                2nd functionality - 'and_raw': also return non-count-modified list
            """
            for entry in full_entries:
                if check_if_entry_does_match(entry, match):
                    return dict(entry)

            raise ValueError(f"No match for '{match}'")

        # 1) apply the logic
        results = []
        for match in matches:
            matching_entry = get_matching_item(lst_of_dict, match)
            results.append(matching_entry)

        # 2) return the logic
        return results

    # # # # # # # # # # # # # # #
    # & RECOUNT-HELPER          #
    @staticmethod
    def recount_matched_entries(entries):
        """ recount the 'count' variable from the start
        """
        copy = list(entries)
        for i, item in enumerate(entries, 1):
            item["count"] = i

        return copy

    # # # # # # # # # # # # # # #
    # RM CROSS-DUPS FROM LST    #
    @staticmethod
    def remove_list_dups(lst1, lst2remove):
        """ removes dups from a copy of lst1;
            throws error if element from 'lst2remove' not in lst1
        """
        copy = list(lst1)
        for item in lst2remove:
            copy.remove(item)

        return copy

    #############################
    # WORKING WITH LISTS        #
    @staticmethod
    def cherrypick_list_by_indices(source_lst, indices_lst):
        """ say; list of 20. This just picks the items of choice, say [1,3] picks 0th and 2nd
            (uses human readable indexes)
        """
        results = []
        for index in indices_lst:
            real_index = index - 1
            results.append(source_lst[real_index])

        return results

    @staticmethod
    def natural_sort_list(lst):  # TODO: rewrite this piece-of-shit code
        """ author is a noob coder, I just didn't want to bother searching my old trustworthy natural search in old repos
        """
        convert = lambda text: int(text) if text.isdigit() else text.lower()
        alphanum_key = lambda key: [convert(c) for c in re.split('([0-9]+)', key)]
        return sorted(lst, key=alphanum_key)

    #############################
    # /HELPERS END              #

    #############################
    # STUFF THAT TILTED ME      #
    @staticmethod
    def jsonify(resp):
        """ monkey patch which strips strings
        """
        if isinstance(resp, str):
            return flask_jsonify(resp.strip())
        else:
            return flask_jsonify(resp)

    #############################
    # API-SPECIFIC STUFF        #
    @staticmethod
    def get_pagination():
        """ extract page number from query string
        """
        # 1) 1 to 100
        num_per_page = request.args.get('num_per_page')
        if num_per_page:
            try:
                npp = int(num_per_page)
                if npp not in range(1, 101):
                    raise PermissionError

                # 1.1) apply
                cf.PAGINATION_PER_PAGE = npp

            # 1.2) throw invalid input
            except ValueError:
                raise ValueError(f"'{num_per_page}' is a bad 'num_per_page' input s#400")
            except PermissionError:
                raise ValueError("'num_per_page' only allows int(s) 1 to 100, yo #400")

        # 2) base functionality
        page = request.args.get('pg')
        if not page:
            return False
        else:
            try:
                page_number = int(page)
                if page_number > 1:
                    return page_number
                else:
                    return False

            except ValueError:
                inner = page.replace("#", "_")
                raise ValueError(f"'{inner}' is a bad page number #400")

    @staticmethod
    def get_pagination_teardown():
        """ default to the default
        """
        cf.PAGINATION_PER_PAGE = cf.PAGINATION_PER_PAGE_DEFAULT

    @staticmethod
    def only_return_active(lst):
        """ only return active items
        """
        new_list = []
        for item in lst:
            if item["active"]:
                new_list.append(item)

        return new_list

    @staticmethod
    def censor_resp_to_users(resp, extra_fields=[]):
        """ needed to not expose sensitive debug fields to users
        """

        # 0) define inner fn(s)
        # 0.1) censor a dict
        def censor_a_dict(mydict):
            """ 8th July 2021, also support extra fields to censor to throw on top
            """
            combined_lst = cf.FIELDS_HIDDEN_FROM_USER + extra_fields
            for field in combined_lst:
                if field in mydict:
                    del mydict[field]

        # 0.2) convert to null
        def convert_dict_values_to_none(mydict):
            """ 16th July 2021, convert "" and "n/a"(s) to null
            """
            if cf.CONVERT_TO_NULL:
                if isinstance(mydict, dict):
                    for a_key in mydict.keys():
                        if mydict[a_key] in ["", "n/a"]:
                            mydict[a_key] = None

        # 1) censor dicts
        if isinstance(resp, dict):
            censor_a_dict(resp)
            convert_dict_values_to_none(resp)

            # 1.1) extension, inner data
            if "data" in resp:
                for item in resp["data"]:
                    censor_a_dict(item)
                    convert_dict_values_to_none(item)

        # 2) censor the list of dict
        elif isinstance(resp, list):
            for item in resp:
                censor_a_dict(item)
                convert_dict_values_to_none(item)

    # # # # # # # # # # # # # # #
    # API FILTERS               #
    def fill_basic_filter_from_query_string(self, filters, query_string_dict):
        """ basic filters: 1) active; 2) chain; 3) tvlStaked > and <; 4) tvlChange24hValue > and <;
        """

        # 0) define inner fn(s)
        def save_xdai(upper):
            """ xDAI is the only non-caps chain
            """
            if upper == "XDAI":
                return "xDAI"
            else:
                return upper

        # 1) show / not show 'active'
        active_is_set = False
        if "active" in query_string_dict:
            value = query_string_dict["active"][0].lower()
            # 1.1) show all
            if value == "all":
                active_is_set = True

            # 1.2) show active-only
            elif value == "true":
                filters["active"] = True
                active_is_set = True

            # 1.3) show inactive-only
            elif value == "false":
                filters["active"] = False
                active_is_set = True

        # 1.4) potentially apply defaults if 1) didn't set anything
        if not active_is_set:
            if cf.ONLY_SHOW_ACTIVE:
                filters["active"] = True

        # 2) 'blockchain' filter
        if "blockchain" in query_string_dict:
            value = query_string_dict["blockchain"][0]
            # 2.1) simple
            if "," not in value:
                filters["blockchain"] = save_xdai(value.upper())

            # 2.2) combined
            else:
                blockchain_filter_array = []
                value_parts = value.split(',')
                for vp in value_parts:
                    a_chain = vp.strip().upper()
                    blockchain_filter_array.append(save_xdai(a_chain))

                filters["blockchain"] = {"$in": blockchain_filter_array}

        # 3) 'chain' filter filter
        if "coin_groups" in query_string_dict:
            coin_groups = cg_logic.return_global_by_global_id("coin_groups")
            coins = cg_logic.return_global_by_global_id("coin_list", "global_coins_dict")
            if "coins" in coins:
                coins = coins["coins"]

            value = query_string_dict["coin_groups"][0]
            # 3.1) Single-Stake
            if "," not in value and ";" not in value:
                if value != "":
                    allowed_coins = self.unpack_coin(coin_groups, coins, value)
                    filters["tokenA"] = {"$in": allowed_coins}

                # 3.1.1) hotfix 'ANY'
                filters["yieldType"] = "Single-Stake"

            # 3.2) LP (Liquidity Provider)
            else:
                if ";" in value:
                    parts = value.split(";")
                else:
                    parts = value.split(",")

                if "" not in parts:
                    # 3.2.1) tiny performance optimize
                    # A) coins or groups are the same
                    if parts[0] == parts[1]:
                        allowed_coins_1 = self.unpack_coin(coin_groups, coins, parts[0])
                        allowed_coins_2 = allowed_coins_1
                    # B) coins or groups are different
                    else:
                        allowed_coins_1 = self.unpack_coin(coin_groups, coins, parts[0])
                        allowed_coins_2 = self.unpack_coin(coin_groups, coins, parts[1])

                    and_filter_1 = {
                        "$and": [{"tokenA": {"$in": allowed_coins_1}}, {"tokenB": {"$in": allowed_coins_2}}]}
                    and_filter_2 = {
                        "$and": [{"tokenB": {"$in": allowed_coins_2}}, {"tokenA": {"$in": allowed_coins_1}}]}
                    if ";" not in value:
                        filters["$or"] = [and_filter_2, and_filter_1]
                    else:
                        filter_3 = {"tokenA": {"$in": allowed_coins_1}, "yieldType": "Single-Stake"}
                        filters["$or"] = [and_filter_2, and_filter_1, filter_3]

                else:
                    if parts.count("") == 1 and len(parts) == 2:
                        parts.remove("")
                        allowed_coins_1 = self.unpack_coin(coin_groups, coins, parts[0])
                        and_filter_1 = {"tokenA": {"$in": allowed_coins_1}}
                        and_filter_2 = {"tokenB": {"$in": allowed_coins_1}}
                        filters["$or"] = [and_filter_2, and_filter_1]

                        # enforce yieldType
                        if ";" not in value:
                            filters["yieldType"] = "LP-Stake"

                # if both are "" - nothing gets applied

        # 4) 'tvl_min' + 'tvl_max' filters (can be combined)
        if 'tvl_min' or "tvl_max" in query_string_dict:
            inner_tvl_min_max = {}  # the 'inner' dictionary
            # 3.1) add TVL min if valid
            if 'tvl_min' in query_string_dict:
                try:
                    value = int(query_string_dict["tvl_min"][0])
                    inner_tvl_min_max["$gt"] = value
                except ValueError:  # don't add on error; invalid_value
                    pass

            # 3.2) add TVL max if valid
            if "tvl_max" in query_string_dict:
                try:
                    value = int(query_string_dict["tvl_max"][0])
                    inner_tvl_min_max["$lt"] = value
                except ValueError:  # don't add on error; invalid_value
                    pass

            # 3.3) append to filters if valid
            if inner_tvl_min_max:
                filters["tvlStaked"] = inner_tvl_min_max

        # 4) 'tvl_change_min` and `tvl_change_max` for 'tvlChange24hValue'
        if 'tvl_change_min' or "tvl_change_max" in query_string_dict:
            inner_tvl_min_max = {}  # the 'inner' dictionary

            # TODO: upgrade these to floats
            # 4.1) add tvl_change_min if valid
            if 'tvl_change_min' in query_string_dict:
                try:
                    value = int(query_string_dict["tvl_change_min"][0])
                    inner_tvl_min_max["$gt"] = value
                except ValueError:  # don't add on error; invalid_value
                    pass

            # TODO: upgrade these to floats
            # 4.2) add tvl_change_max if valid
            if "tvl_change_max" in query_string_dict:
                try:
                    value = int(query_string_dict["tvl_change_max"][0])
                    inner_tvl_min_max["$lt"] = value
                except ValueError:  # don't add on error; invalid_value
                    pass

            # 4.3) append to filters if valid
            if inner_tvl_min_max:
                filters["tvlChange24hValue"] = inner_tvl_min_max

    @staticmethod
    def fill_all_assets_endpoint_filter(filters, query_string_dict):
        """ helper which fills assets endpoint filter correctly from da query-string, currently only apr_min, apr_max
        """
        # TODO: both this and other can be carried out as DRY
        # 1) 'apr_yearly_min' + 'apr_yearly_max' filters (can be combined)
        if 'apr_yearly_min' or "apr_yearly_max" in query_string_dict:
            inner_min_max = {}  # the 'inner' dictionary
            # 1.1) add apr_yearly_min if valid
            if 'apr_yearly_min' in query_string_dict:
                try:
                    value = int(query_string_dict["apr_yearly_min"][0])
                    inner_min_max["$gt"] = value
                except ValueError:  # don't add on error; invalid_value
                    pass

            # 1.2) add apr_yearly_max if valid
            if "apr_yearly_max" in query_string_dict:
                try:
                    value = int(query_string_dict["apr_yearly_max"][0])
                    inner_min_max["$lt"] = value
                except ValueError:  # don't add on error; invalid_value
                    pass

            # 1.3) append to filters if valid
            if inner_min_max:
                filters["aprYearly"] = inner_min_max

        # 2) simple filters '4th September 2021'
        # 2.0) fields dict
        fields_dict = {
            "deposit_fee_lte": "depositFee",
            "withdrawal_fee_lte": "withdrawalFee",
            "harvest_lockup_bool": "harvestLockup",
            "transfer_tax_bool": "transferTax"
        }

        # 2.1) and 2.2) 'deposit_fee_lte' and 'withdrawal_fee_lte'
        for a_field in ["deposit_fee_lte", "withdrawal_fee_lte"]:
            if a_field in query_string_dict:
                value = query_string_dict[a_field][0]
                try:
                    float_value = float(value)
                    the_field = fields_dict[a_field]
                    filters[the_field] = {"$lte": float_value}
                except:
                    pass  # too lazy to add logging

        # 2.3) 'harvest_lockup_bool'
        if "harvest_lockup_bool" in query_string_dict:
            value = query_string_dict["harvest_lockup_bool"][0]
            _vl_dict = {
                "true": True,
                "false": False
            }
            try:
                _vl = value.lower()
                if _vl in ["true", "false"]:
                    bool_value = _vl_dict[_vl]
                    the_field = fields_dict["harvest_lockup_bool"]
                    filters[the_field] = bool_value
            except:
                pass

        # 2.4) 'transfer_tax_bool'
        if 'transfer_tax_bool' in query_string_dict:
            value = query_string_dict["transfer_tax_bool"][0]
            try:
                _vl = value.lower()
                inner_filter = None
                if _vl == "true":
                    inner_filter = {"$gte": 0.01}
                elif _vl == "false":
                    inner_filter = 0.0

                if inner_filter or inner_filter == 0.0:
                    the_field = fields_dict["transfer_tax_bool"]
                    filters[the_field] = inner_filter

            except:
                pass

    # EXPERIMENTAL_ASSET_COMBO_FILTERS
    # TODO: should be refactored with blockchain
    @staticmethod
    def fill_experimental_assets_combo_filters(filters, query_string_dict):
        """ experimental, derived from 'blockchain' filter for farms but now supports many
        """

        # 1) define inner fn(s)
        def add_filter(query_key, asset_key):
            """ inner 'add filter' from query string
            """
            # 1) as a single-filter
            if query_key in query_string_dict:
                value = query_string_dict[query_key][0]
                # 1.1) simple
                if "," not in value:
                    filters[asset_key] = value.strip()

                # 1.2) combined-filter
                else:
                    filter_array = []
                    value_parts = value.split(',')
                    for vp in value_parts:
                        filter_array.append(vp.strip())

                    filters[asset_key] = {"$in": filter_array}

        # 2) go through the global config
        for query_key in cf.ASSET_COMBO_FILTERS:
            asset_key = cf.ASSET_COMBO_FILTERS[query_key]
            add_filter(query_key, asset_key)

    # # # # # # # # # # # # # # #
    # SEARCH                    #
    @staticmethod
    def add_search_filter(filters, query_string_dict, view="farms"):
        """ adds case-insensitive match search to the database
        """
        # 1) return early if no search needed
        if "search" not in query_string_dict:
            return

        # 2) apply the search
        else:
            # 2.1) pick correct search field
            if view in cf.SEARCH_FIELDS:
                search_field = cf.SEARCH_FIELDS[view]
            else:
                raise ValueError("programmer fu** up the search, please be patient for a fix #503")

            # 2.2) pick and regex search value
            value = query_string_dict["search"][0]
            if len(value) > cf.MAX_SEARCH_NUM_CHARS:  # throw long strings
                raise ValueError("no long search strings, people! #400")

            # & escape
            escaped_value = re.escape(value)

            # 2.3) add search to filters
            filters[search_field] = {"$regex": escaped_value, "$options": "i"}
            # & return 'search string raw'
            return value

    # # # # # # # # # # # # # # #
    # SORT FILTER               #
    @staticmethod
    def extract_sort_from_qs(query_string_dict, view="farm"):
        """ extracts 'sort' tuple from query-string if 'sort' present
        """
        # 1) unpack list of allowed sorts
        if view in cf.ALLOWED_SORTS:
            allowed_sorts = cf.ALLOWED_SORTS[view]
        else:
            raise ValueError("The dev messed up, pls wait for a fix! #501")

        # 2) churn out the actual sort tuple
        asc_desc_integer = 1
        if "sort" in query_string_dict:
            value = query_string_dict["sort"][0]
            if value in allowed_sorts:
                # 2.1) apply reverse order, if appropriate
                if "sort_order" in query_string_dict:
                    order_value = query_string_dict["sort_order"][0]
                    if order_value == "desc":
                        asc_desc_integer = -1

                # 2.2) return the actual filter
                return value, asc_desc_integer

            else:
                raise ValueError(f"Sort by '{value}' is not supported #400")

        # 3) return defaults
        # 3.1) default sort tuple, if specified in config
        elif cf.DEFAULT_SORT:
            return cf.DEFAULT_SORT
        # 3.2) else return false (this will not trigger .sort() in db)
        else:
            return False

    #############################
    # EXPERIMENTALS             #
    @staticmethod
    def add_highlight(data, search_string_raw, entry_type="farms"):
        """ search
        """
        # 1) unpack search_field
        if entry_type in cf.SEARCH_FIELDS:
            search_field = cf.SEARCH_FIELDS[entry_type]
        else:
            raise ValueError("Programmer made a mistake, #503")

        # 1) unpack search string as lowercase
        search_string = search_string_raw.lower()

        # 2) iterate the data
        for item in data["data"]:
            item_search_name = item[search_field]
            item_search_name_lower = item_search_name.lower()
            # 3.1) Big Brain Part
            name_temp = str(item_search_name)
            my_yield = []
            my_array = [x.span() for x in re.finditer(search_string, item_search_name_lower, re.I)]
            for my_tuple in my_array:
                i_a, i_b = my_tuple  # unpack tuple
                goods = item[search_field][i_a:i_b]
                name_temp = name_temp.replace(goods, '{}')
                my_yield.append(f"<span class='span_colorize_43'>{goods}</span>")

            # 3.2) BIG BRAIN II
            big_brain = name_temp.format(*my_yield)
            item["colorizedHtml"] = big_brain


utils = Utils()
