""" interface for performing database operations
"""
# std. lib
import os
import json
import logging
import math

# database
from pymongo import MongoClient

# user-libs
from multifarm_api.config import config as cf

# init MongoDB
client = MongoClient(f"mongodb://{cf.MONGO_USER}:{cf.MONGO_PASS}@{cf.MONGO_HOST}")
project_db = client[cf.DB_NAME]


class DbHandles:

    #############################
    # HELPERS:                  #
    @staticmethod
    def get_db_print_name(db_id, sub_id=False):
        """ give db's print name (printable name)
        """
        if sub_id:
            return "{}:{}".format(db_id, sub_id)
        else:
            return db_id

    @staticmethod
    def cursor_to_list(cursor):
        """ unpacks a MongoDB cursor to a Python list
        """
        results = []
        for item in cursor:
            results.append(item)

        return results

    #############################
    # DB MAINTENANCE:           #
    @staticmethod
    def get_db(db_id, sub_id=False):
        """ return db matching 'db_id' + 'sub_id'
        """
        if sub_id:
            return project_db[db_id][sub_id]
        else:
            return project_db[db_id]

    # # # # # # # # # # # # # # #
    # DUMP DB!                  #

    def dump_db(self, db_id, sub_id, name):
        """ dump a certain database to a .json file
        """
        # 1) extract the results
        results = self.get_entries(db_id, sub_id)

        # 2) save
        f_name = cf.DB_DUMP_DIR + os.sep + "{}.json".format(name)
        with open(f_name, "w", encoding="utf-8") as f:
            f.write(json.dumps(results, indent=4))
            logging.info("[db_dump()] dumped db (#{} entries) to '{}'".format(len(results), f_name))

    @staticmethod
    def delete_db_copy(name):
        """ delete a database dump from the disc
        """
        # 1) make full file name same as in dump_db()
        f_name = cf.DB_DUMP_DIR + os.sep + "{}.json".format(name)
        try:
            os.remove(f_name)
            logging.info(f"[delete_db_copy()] deleted '{f_name}'")
            return True
        except FileNotFoundError:
            logging.warning(f"[delete_db_copy()] no such file '{f_name}', couldn't delete anything ")
            return False

    # # # # # # # # # # # # # # #
    # RESET DB!                 #
    def reset_collection(self, db_id, sub_id, results, drop_collection=False):
        """ reverse of [db_dump()]
        """
        # 0) some fancyness
        droppo_text = ""

        # 1) drop the 'collection' if wanted
        if drop_collection:
            self.drop_db(db_id, sub_id, False)
            droppo_text = " dropped, and then"

        # 2) insert the entries to db
        self.insert_entries(results, db_id, sub_id)
        logging.info(f"[reset_db()]{droppo_text} inserted #{len(results)} entries to '{sub_id}' collection")

    # # # # # # # # # # # # # # #
    # DROP DB !                 #
    def drop_db(self, db_id, sub_id=False, ask_confirm=True):
        """ drop the db, optionally, if the user says 'yes' (for risk aversion)
        """
        # 0) get print_name for to-be print statements
        db_print_name = self.get_db_print_name(db_id, sub_id)

        # 1) pick the correct collection as 'db'
        if sub_id:
            db = project_db[db_id][sub_id]
        else:
            db = project_db[db_id]

        # 2) drop the db
        # 2.B) with confirm
        if ask_confirm:
            while True:
                input_value = input("are you sure you wanna drop the db? y/n: ")
                if input_value.lower() == "y":
                    db.drop()
                    logging.info("[db_handles.drop_db()] dropped '{}' db collection".format(db_print_name))
                    break

                if input_value.lower() == "n":
                    db.drop()
                    logging.info("did NOT drop the db collection due to the user's input".format(db_print_name))
                    break

        # 2.B) without a confirm
        else:
            logging.info("[db_handles.drop_db()] dropped '{}' db collection".format(db_print_name))
            db.drop()

    #############################
    # DB OPERATIONS:            #

    # # # # # # # # # # # # # # #
    # GET ENTRIES:              #
    def get_entry(self, db_id, sub_id=False, a_filter={}):
        """ get db entry
        """
        db = self.get_db(db_id, sub_id)
        entry = db.find_one(a_filter)
        if entry:
            del entry["_id"]

        return entry

    def get_entries(self, db_id, sub_id=False, a_filter={}, sort=False, pg=0, get_page_count=False, them_all=False):
        """ get db entries
        """
        # 1) initialize
        results = []
        db = self.get_db(db_id, sub_id)

        # 2) [COUNT! functionality]
        if get_page_count:
            count = db.count(a_filter)
            return math.ceil(count / cf.PAGINATION_PER_PAGE)

        # 3) get data
        # 3.1) get count to skip
        if pg and pg > 1:
            count_skip = (pg - 1) * 50
        else:
            count_skip = 0

        # 3.2) get the actual data
        if not sort:
            if not them_all:
                query = db.find(a_filter).skip(count_skip).limit(cf.PAGINATION_PER_PAGE)
            else:
                query = db.find(a_filter).skip(count_skip)
        else:
            if not them_all:
                query = db.find(a_filter).sort([sort]).skip(count_skip).limit(cf.PAGINATION_PER_PAGE)
            else:
                query = db.find(a_filter).sort([sort]).skip(count_skip)

        # 4) unpack db items into a list, return this list
        for item in query:
            del item["_id"]
            results.append(item)

        return results

    # # # # # # # # # # # # # # #
    # INSERT ENTRY(s)           #
    def insert_entry(self, entry, db_id, sub_id=False):
        """ insert a single new entry to the db
        """
        db = self.get_db(db_id, sub_id)
        db.insert_one(entry)

    def insert_entries(self, entries, db_id, sub_id=False):
        """ insert a single new entry to the db
        """
        # 1) pick db
        db = self.get_db(db_id, sub_id)

        # 2) hotfix to support . in sub-keys
        # 2.1) run normal
        if not cf.RESET_IN_UPDATE_MODE:
            db.insert_many(entries)
        # 2.2) run alternative mode
        else:
            self.update_entries("global_id", entries, db_id, sub_id, upsert=True)
            logging.warning(f"{db_id}_{sub_id} colls' entries inserted in update mode")

        logging.info("[insert_entries()] inserted #{} new entries to db".format(len(entries)))

    # # # # # # # # # # # # # # #
    # UPDATE ENTRY(s)           #
    def update_entries(self, query_key, list_of_entries, db_id, sub_id=False, upsert=False):
        """ update entries; done crude way with for loop
        """
        # 1) do it the crude way
        for item in list_of_entries:
            query = {query_key: item[query_key]}
            self.update_entry(query, item, db_id, sub_id, upsert)

    def update_entry(self, query, fields_to_update, db_id, sub_id=False, upsert=False):
        """ update an entry to the db
            'fields_to_update' = dictionary of fields to update
        """
        # 1) do the update
        db = self.get_db(db_id, sub_id)
        # database_resp = db.update_one(query, {"$set": fields_to_update}, upsert=upsert)
        _ = db.update_one(query, {"$set": fields_to_update}, upsert=upsert)

        # 1.1) return if modified
        return bool(_.modified_count)

    def unset_entry_fields(self, query, fields_to_unset, db_id, sub_id=False):
        """ unsets fields from an individual entry
        """
        # 1) do the update
        db = self.get_db(db_id, sub_id)
        _ = db.update_one(query, {"$unset": fields_to_unset})

        # 1.1) return if modified
        return bool(_.modified_count)

    # # # # # # # # # # # # # # #
    # DELETE AN ENTRY (ONE)     #
    def delete_entry(self, query, db_id, sub_id=False):
        """ delete a single entry from a db or a sub-db
        """
        # 1) do 'delete one'
        db = self.get_db(db_id, sub_id)
        database_resp = db.delete_one(query)

        # 1.1) return 'True' if deleted an entry
        return bool(database_resp.deleted_count)

    # # # # # # # # # # # # # # #
    # DELETE ENTRIES (MANY)     #
    def delete_entries(self, query, db_id, sub_id=False):
        """ delete all entries from a db or a sub-db which match a query
        """
        # 1) do 'delete many'
        db = self.get_db(db_id, sub_id)
        database_resp = db.delete_many(query)

        # 1.1) return 'True' if deleted an entries
        return database_resp.deleted_count

    def delete_entries_2(self, query_key, list_of_entries, db_id, sub_id=False):
        """ delete all entries from a db based off 'query_key' of all entries given
        """
        # 1) do it the crude way
        for item in list_of_entries:
            query = {query_key: item[query_key]}
            self.delete_entry(query, db_id, sub_id)


db_handles = DbHandles()
