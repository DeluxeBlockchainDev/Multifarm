import copy
import sys
import logging
from multifarm_api.config import config as cf


class DataEntryFunctionality:

    IMMUTABLE_FIELDS = {
        "farms": {
            "farmId": None,  # would break linkage
            "blockChain": None,  # would break linkage
            "tvlStakedHistory": None,  # auto-calculated array, currently doesn't support edits
            "dateAdded": None,  # date added
            "dateUpdated": None  # gets calculated automatically
        },
        "assets": {
            "source": None,  # who input it it's his asset
            "aprDaily": None,  # [autocalc]
            "aprWeekly": None,  # [autocalc],
            "aprHistory": None,  # auto-calculated array, currently doesn't support edits
            "tvlStakedHistory": None  # auto-calculated array, currently doesn't support edits
        }
    }

    HIDDEN_FIELDS = {
        "farms": {
            "lastFullUpdate": None  # admin field just for me, maybe gets removed later
        },
        "assets": {
            "[debug]_#th_entry": None,
            "[debug]_url": None,
            "d_active_reason": None
        }
    }


    #############################
    # LOCAL HELPERS             #
    @staticmethod
    def produce_multi_fields(lst):
        """ needs pre-processed list
        """
        # 0) define inner fn(s)
        # 0.1) count up the dict
        def count_up_the_dict(lst, dict_name, field_name):
            """ modifies count_dict via calculated values from using this method
            """
            # 1) init
            resp_dict = count_dict[dict_name]

            # 2) iterate
            for inner_lst in lst:
                for field in inner_lst:

                    # 2.1) convert to str-repr to support inner dict and or inner list values
                    value = inner_lst[field][field_name]
                    key = str(inner_lst[field][field_name])

                    # 2.2) do the work
                    if field not in resp_dict:
                        resp_dict[field] = {key: value}
                    else:
                        resp_dict[field][key] = value

        # 1) init count dict
        count_dict = {
            "normals": {},
            "lockeds": {},
            "immutables": {}
        }

        # 2) return lst #1 (no 'varies' appliance needed)
        if len(lst) == 1:
            return lst

        # 3) count dict using inner fn
        count_up_the_dict(lst, "normals", "value")
        count_up_the_dict(lst, "lockeds", "locked")
        count_up_the_dict(lst, "immutables", "immutable")  # cheap hotfix

        # 4) cook up multi_list fields
        multi_fields_dict = {}

        cdn = count_dict["normals"]
        cdl = count_dict["lockeds"]
        cdi = count_dict["immutables"]
        for a_key in cdn:
            # 4.1) handle normal values
            value_dict_n = cdn[a_key]
            dict_keys_n = list(value_dict_n.keys())
            if len(dict_keys_n) > 1:
                value = cf.VARIED_NAME
            else:
                value = value_dict_n[dict_keys_n[0]]

            # 4.2) handle locked values
            value_dict_l = cdl[a_key]
            dict_keys_l = list(value_dict_l.keys())
            if len(dict_keys_l) > 1:
                locked = cf.VARIED_NAME
            else:
                locked = value_dict_l[dict_keys_l[0]]

            # 4.3) handle immutable values
            value_dict_i = cdi[a_key]
            dict_keys_i = list(value_dict_i.keys())
            if len(dict_keys_i) > 1:
                immutable = cf.VARIED_NAME
            else:
                immutable = value_dict_i[dict_keys_i[0]]

            # 4.4) append the combination
            entry = {"value": value, "locked": locked, "immutable": immutable}
            multi_fields_dict[a_key] = entry

        # 5) return the yield
        return multi_fields_dict


    #############################
    # GLOBAL HELPERS            #
    @staticmethod
    def get_edits_from_fields(fields):
        """ get edits from fields functionality
        """
        # 1) init stuff which will hold values
        values = {}
        lock_true = {}
        lock_false = {}

        # 2) iterate
        for key in fields:
            inner = fields[key]
            # 2.1) unpack value
            if "value" in inner:
                inner_value = inner["value"]
                if inner_value != cf.VARIED_NAME:
                    values[key] = inner["value"]
                else:
                    logging.warning(f"'{key}'")

            # & locked
            if "locked" in inner:
                locked_value = inner["locked"]
                # 2.2.1) unpack lock = True
                if locked_value == True:
                    lock_true[key] = None

                # 2.2.2) unpack lock = False
                elif locked_value == False:
                    lock_false[key] = None

        # 3) make & return edits dict
        edits_dict = {
            "values": values,
            "lock_true": lock_true,
            "lock_false": lock_false
        }
        return edits_dict


    #############################
    # UNPACK STUFF              #
    def unpack_single_entry(self, entry, entry_type):
        """ unpack stuff up
        """
        # 1) throw bad entries
        if entry_type not in ["assets", "farms"]:
            raise ValueError(f"wrong entry type '{entry_type}'")

        # 2) unpack
        # 2.1) pick locks (I'm using dict because to check if something is in dict is faster than in array)
        locks_dict = {}
        if "_locks" in entry:
            for _ in entry["_locks"]:
                locks_dict[_] = None
        else:
            locks_dict = {}

        # 3) skip + unpack: value, locked, immutable
        entry_out = {}
        for a_key in entry:
            if a_key in self.HIDDEN_FIELDS[entry_type]:
                continue

            value = entry[a_key]
            locked = a_key in locks_dict
            immutable = a_key in self.IMMUTABLE_FIELDS[entry_type]
            entry_out[a_key] = {"value": value, "locked": locked, "immutable": immutable}

        # 4) return the entry
        return entry_out

    def unpack_multiple_entries(self, entries, entry_type):
        """ unpack list of stuff up
        """
        # 1) unpack a list of items
        new_list = []
        for entry in entries:
            new_list.append(self.unpack_single_entry(entry, entry_type))

        # 2) produce multi-fields
        fields_list = self.produce_multi_fields(new_list)

        # 3) push out
        result = {
            "entries": new_list,
            "fields": fields_list
        }

        return result


data_entry_functionality = DataEntryFunctionality()