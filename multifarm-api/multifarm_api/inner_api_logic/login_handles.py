from multifarm_api.db_handles import db_handles as db_h


class LoginHelpers:
    #############################
    # HELPERS                   #
    @staticmethod
    def get_users_data(username):
        """ gets user's data
        """
        # 1) get entries, return False if no entries
        entries = db_h.get_entries("api", "logins", {"username": username})
        if not entries:
            return False

        # 2) return entry without _id as the data
        entry = entries[0]
        return entry

    #############################
    # FUNCTIONALITY             #
    def require_user_level(self, user, lvl=2):
        """ returns False if user is good enough
        """
        # 1) try finding reasons to deny
        try:
            # 1.1) deny if not in the db
            matching_user = self.get_users_data(user)
            if not matching_user:
                raise ValueError

            # 1.2) deny if too low access level
            if matching_user and matching_user["access_lvl"] < lvl:
                raise ValueError

        # 2) react on throws via returning value
        except:
            return "not high enough access right", 403

        # 3) gets here = returns False = doesn't get denied

    def login(self, user):
        """ color
        """
        matching_user = self.get_users_data(user)
        user_data = {
            "user": user,
            "user_color": matching_user["color"]
        }

        return user_data, 200


login_handles = LoginHelpers()
