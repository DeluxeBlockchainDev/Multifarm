# std. lib
import os
import json
import logging
from pathlib import Path

# user libs
from multifarm_api.config import config as cf
from multifarm_api.db_handles import db_handles as db_h
from multifarm_api.utils import utils as ut


#############################
# DB BACKUPS FUNCTIONALITY  #


# # # # # # # # # # # # # # #
# 1) SHOW BACKUPS           #
def return_list_backups():
    backups = os.listdir(cf.DB_DUMP_DIR)
    return backups


# # # # # # # # # # # # # # #
# 2) CREATE BACKUPS         #
@ut.time_it
def make_db_backup(backup_name, single_chain=False):
    """ backup a db to config folder storing the databases
    """
    # 0) define inner fn(s)
    # 0.1) normal mode
    def normal_mode(backup_name):
        # 1) unpack file paths
        filename = f"{backup_name}.json"
        full_path = f"{cf.DB_DUMP_DIR}{os.sep}{filename}"

        # 1.1) throw error on an existing file path
        p = Path(full_path)
        if p.exists():
            return "can't rewrite db backups, delete old one first!", 403

        # 2) farms, assets, globals:

        # 2.1) set pagination to huge number to bypass limit
        cf.PAGINATION_PER_PAGE = 1000000
        # 2.2) get stuff
        farm_entries = db_h.get_entries("api", "farms")
        asset_entries = db_h.get_entries("api", "assets")
        global_entries = db_h.get_entries("api", "globals")
        # 2.3) set pagination back to default
        cf.PAGINATION_PER_PAGE = cf.PAGINATION_PER_PAGE_DEFAULT

        # & construct db_dump structure
        db_dump = {
            "farms": farm_entries,
            "assets": asset_entries,
            "globals": global_entries,
            "time_isoformat": ut.get_utctime()
        }

        # 3) dump it
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(json.dumps(db_dump))
            logging.info(f"wrote a full database backup to '{full_path}'")

        # 4) return error code
        return "successfully backed up API db", 200

    # 0.2) single chain mode
    def single_chain_mode(backup_name, single_chain):
        # 1) unpack file paths
        filename = f"{backup_name}_{single_chain}.json"
        full_path = f"{cf.DB_DUMP_DIR}{os.sep}{filename}"

        # 1.1) throw error on an existing file path
        p = Path(full_path)
        if p.exists():
            return "can't rewrite db backups, delete old one first!", 403

        # 2) farms, assets, globals:
        # 2.1) set pagination to huge number to bypass limit
        cf.PAGINATION_PER_PAGE = 1000000
        # 2.2) precook up filter
        the_filter = {"blockchain": single_chain}
        # 2.3) get stuff
        farm_entries = db_h.get_entries("api", "farms", the_filter)
        asset_entries = db_h.get_entries("api", "assets", the_filter)
        global_entries = db_h.get_entries("api", "globals")
        # 2.4) set pagination back to default
        cf.PAGINATION_PER_PAGE = cf.PAGINATION_PER_PAGE_DEFAULT

        # & construct db_dump structure
        db_dump = {
            "blockchain": single_chain,
            "farms": farm_entries,
            "assets": asset_entries,
            "globals": global_entries,
            "time_isoformat": ut.get_utctime()
        }

        # 3) dump it
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(json.dumps(db_dump))
            logging.info(f"wrote a single-chain '{single_chain}' backup to '{full_path}'")

        # 4) return error code
        return "successfully backed up a single-chain db", 200

    # 1) run
    # 1.1) normal mode
    if not single_chain:
        return normal_mode(backup_name)

    # 1.2) single chain mode
    else:
        return single_chain_mode(backup_name, single_chain)


# # # # # # # # # # # # # # #
# 3) LOAD BACKUPS           #
@ut.time_it
def load_db_backup(backup_name, full_path=False, single_chain=False):
    """ reset database with .json backup in 'backup_name'
        warning currently deletes the db w/o an auto 'quicksave'
    """
    # 0) define inner fn(s)
    # 0.1) load in default mode
    def load_in_default_mode():
        """ default mode = fully reload both database
        """
        # 1) unpack file paths
        # 1.1) filename is full_path given
        if LG.full_path:
            full_path = backup_name

        # 1.2) generate (default)
        else:
            filename = f"{backup_name}.json"
            full_path = f"{cf.DB_DUMP_DIR}{os.sep}{filename}"

        # 1.3) throw error on no existing file path
        p = Path(full_path)
        if not p.exists():
            return f"no such backup '{backup_name}'!", 400

        # 2) load
        with open(full_path) as f:
            backup_data = json.loads(f.read())

        # 2.1) unpack
        farms, assets, db_globals = backup_data["farms"], backup_data["assets"], backup_data["globals"]

        # 2.2) reset
        db_h.reset_collection("api", "farms", farms, True)
        db_h.reset_collection("api", "assets", assets, True)

        cf.RESET_IN_UPDATE_MODE = True
        db_h.reset_collection("api", "globals", db_globals)
        cf.RESET_IN_UPDATE_MODE = False

        # 2.3) return positive response
        return f"successfully reset db to '{backup_name}'", 200

    # 0.2) load in single mode
    def load_in_single_mode():
        """ load single mode = just one chain
        """
        # 0) definer inner fn(s)
        def delete_and_load(db, sub_db, data, a_filter):
            """ load db; but based on query
            """
            db_h.delete_entries(a_filter, db, sub_db)
            db_h.insert_entries(data, db, sub_db)

        # 1) unpack file paths
        # 1.1) filename is full_path given
        if LG.full_path:
            full_path = backup_name

        # 1.2) generate (default)
        else:
            filename = f"{backup_name}_{single_chain}.json"
            full_path = f"{cf.DB_DUMP_DIR}{os.sep}{filename}"

        # 1.3) throw error on no existing file path
        p = Path(full_path)
        if not p.exists():
            print(f"returning no such backup on '{full_path}'")
            return f"no such backup '{backup_name}'!", 400

        # 2) load
        with open(full_path) as f:
            backup_data = json.loads(f.read())

        # 2.1) check if backup is valid
        if "blockchain" not in backup_data:
            return f"'{backup_name}' is not a single-chain backup!", 400

        # 2.2) unpack
        farms, assets, db_globals, blockchain = backup_data["farms"], backup_data["assets"], backup_data["globals"], \
                                                backup_data["blockchain"]

        # 2.3) reset
        a_filter = {"blockchain": blockchain}
        delete_and_load("api", "farms", farms, a_filter)
        delete_and_load("api", "assets", assets, a_filter)

        cf.RESET_IN_UPDATE_MODE = True
        db_h.reset_collection("api", "globals", db_globals)
        cf.RESET_IN_UPDATE_MODE = False

        # 2.4) return positive response
        return f"successfully partial reset '{blockchain}' blockchain + globals to '{backup_name}'", 200

    # 1) make weird class to avoid 'full_path' thing
    class LGlobals:
        def __init__(self):
            self.backup_name = backup_name
            self.full_path = full_path
            self.single_chain = single_chain

    LG = LGlobals()

    # 2) run
    # 2.1) default mode
    if not LG.single_chain:
        return load_in_default_mode()

    # 2.2) single chain mode
    else:
        return load_in_single_mode()

# # # # # # # # # # # # # # #
# 4) DELETE BACKUP(S)       #
def delete_backup(backup_name):
    """ delete a backup or multiple backups from the backup directory
    """
    # 1) unpack file paths
    filename = f"{backup_name}.json"
    full_path = f"{cf.DB_DUMP_DIR}{os.sep}{filename}"

    # 1.1) throw error on no existing file path
    p = Path(full_path)
    if not p.exists():
        return f"no such backup '{backup_name}' to delete!", 400

    # 2) delete + return status
    p.unlink()
    return f"deleted '{backup_name}'", 200


# # # # # # # # # # # # # # # #
# # 5) NUKE DB                #
# def nuke_db():
#     """ drop the current database
#     """
#     db_h.drop_db("api", "assets", ask_confirm=False)
#     db_h.drop_db("api", "farms", ask_confirm=False)
#     db_h.drop_db("api", "globals", ask_confirm=False)
#
#     return "nuked.", 200
