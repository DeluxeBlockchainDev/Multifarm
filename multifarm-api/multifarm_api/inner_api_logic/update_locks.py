from multifarm_api.utils import utils as ut


class UpdateLocks:

    #############################
    # 1/3) GET (NEW) LOCKS      #
    @staticmethod
    def get_new_locks(old_entry, fields_to_lock={}, fields_to_unlock={}):
        """ set locks array.
        """
        # 0) def inner inner fn(s)
        def list_to_dict(lst):
            """ convert list to dict
            """
            mydict = {}
            for item in lst:
                mydict[item] = None

            return mydict


        # 1) get old locks
        try:
            locks = old_entry["_locks"]
        except KeyError:
            locks = []

        # 2) lock stuff up 'add stuff to locks'
        locks_dict = list_to_dict(locks)
        for field in fields_to_lock:
            if field not in locks_dict:
                # & avoid duplicates on 'adding in' potential data error
                locks_dict[field] = None
                locks.append(field)

        # 3) unlock stuff 'remove stuff from locks'
        locks_dict = list_to_dict(locks)
        for field in fields_to_unlock:
            if field in locks_dict:
                locks.remove(field)

        # 4) return sorted locks
        locks.sort()
        return locks


    #############################
    # 2/3) INIT LOCKS           #
    @staticmethod
    def init_locks_if_needed(entry, old_entry):
        """
        """
        # 1) add '_locks' field if not present
        if not old_entry:
            # 1.1) if new entry w/o '_locks' field
            if "_locks" not in entry:
                entry["_locks"] = []

        else:
            # 1.2) if both old and new don't have '_locks' field
            if "_locks" not in old_entry and "_locks" not in entry:
                entry["_locks"] = []

    #############################
    # 3/3) USE LOCKS (DELETE)   #
    @staticmethod
    def apply_locks(entry, old_entry):
        """ [for scraper pushes] - if old entry has '_locks' field, apply stuff up
        """
        if "_locks" in old_entry:
            locks = old_entry["_locks"]
            for lock in locks:
                try:
                    del entry[lock]
                except KeyError:
                    pass  # pass atm


update_locks = UpdateLocks()
