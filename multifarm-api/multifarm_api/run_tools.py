""" Script designed to upload temporary logins .json (generated in another script)
    into the database. So that credentials are not lying around being hard-coded.
"""


# std. lib
import os
import sys
import json
import argparse

# user lib
import db_handles as db_h
import config as cf


def run():
    """ run the script
    """
    # 1) define local constants
    ACTIONS_PERMITTED = ["upload_logins"]

    # 2) init argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--action', required=True, help=f"actions supported = {ACTIONS_PERMITTED}")
    args = parser.parse_args()
    # & get 'action'
    action = args.action

    # 3) process action
    # 3.1) 'upload_logins'
    if action == "upload_logins":
        top_level_files = os.listdir(".")
        # 3.1.2) throw if no file
        if cf.LOGINS_FILENAME not in top_level_files:
            print(f"this command needs a temporary '{cf.LOGINS_FILENAME}' (to be deleted after upload) in top level dir to work")
            sys.exit(0)

        # 3.2.3) get data
        with open(cf.LOGINS_FILENAME) as f:
            data = json.loads(f.read())

        # 3.3.4) re-upload the collection whilst dropping the collection
        db_h.reset_collection("api", cf.LOGINS_COLLECTION, data, True)
        # & delete the temp file
        os.remove(cf.LOGINS_FILENAME)

        # 3.3.5) print success and exist
        print(f"successfully reset db as #{len(data)} available logins, temp. file deleted")
        sys.exit(0)

    # 3.Z) give 'retry' printout if no valid action given
    else:
        actions_str = "', '".join(ACTIONS_PERMITTED)
        print(f"action needs to be one of '{actions_str}'")
        sys.exit(0)


if __name__ == "__main__":
    run()
