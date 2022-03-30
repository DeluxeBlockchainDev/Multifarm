import os
from multifarm_api import config as cf

#############################
# URL(s)                    #
API_WELCOME_URL = "http://127.0.0.1:8000"
API_FULL_BASE = f"{API_WELCOME_URL}/{cf.SECRET_URL_BASE}"


#############################
# TESTING BACKUP DIRS       #
TESTING_DUMP_DIR = f"{cf.TESTING_DIR_BASE}{os.sep}dumps"
TESTING_REQUESTS_DATA_DIR = f"{cf.TESTING_DIR_BASE}{os.sep}requests"
TESTING_OTHER_SAMPLE_DATA_DIR = f"{cf.TESTING_DIR_BASE}{os.sep}other_sample_data"


#############################
# DB BACKUP NAMES           #

# 1) 'TEMP_BACKUP_NAME' stores the real database under this name in normal backups dir
TEMP_BACKUP_NAME = "temporary_testing_backup"
# 1.1) Apply single-chain? Set 'false' if no
SINGLE_CHAIN = "AVAX"

# 2) 'TESTING_DB_BASE_DUMP' holds the testing database we reset database to, whilst testing
TESTING_DB_BASE_DUMP = f"{TESTING_DUMP_DIR}{os.sep}testing_database.json"
TESTING_DB_AVAX_BASE_DUMP = f"{TESTING_DUMP_DIR}{os.sep}testing_database_AVAX.json"


#############################
# DEMO LOGINS               #

# DEMO LOGINS
users = {
    "admin": {
        "username": "for_tests_only_admin",
        "password": "testing_password_admin"
    },
    "data_entry_user": {
        "username": "for_tests_only_user",
        "password": "testing_password_user"
    }
}

# DEMO LOGINS (TO PUSH TO DB)
DEMO_LOGINS_LIST = [
    {
        "username": "for_tests_only_admin",
        "access_lvl": 10,
        "color": "#000000",
        "password": "pbkdf2:sha256:260000$EEVzbbjG7zJp88b2$5764b3cbcaf1dfe45d9276f9acb8b7419ff8f8855ec4a0b903a26d66529702d9"
    },
    {
        "username": "for_tests_only_user",
        "access_lvl": 1,
        "color": "#FFFF00",
        "password": "pbkdf2:sha256:260000$A3QvBEbng9xCxTeH$b275591acbbdcd6d54756b9f9f3a5993b7c3cc4a7ef61551788d08df4b98022e"
    }
]