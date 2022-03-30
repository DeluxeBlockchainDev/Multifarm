import { AccountModel } from "../../models/account";
import { UserModel } from "../../models/user";
import { UpdateProfileInput } from "../../inputs/user";

/**
 * Function creates user, default account, and membership records.
 * Additionally, it creates initial WYRE wallet for user.
 * @param {Object} user - Details
 * @param {string} user.authId Firebase Auth User UID
 * @param {string} user.firstName - The first name of the user
 * @param {string} user.lastName - The last name of the user
 * @param {string} userName - username requested by user
 */

export const modifyUserProfile = async (
  uid: string,
  accountId: number,
  { firstName, lastName }: UpdateProfileInput,
): Promise<AccountModel> => {
  if (firstName.length < 1 || lastName.length < 1) {
    throw new Error("Length of name parameter not long enough");
  }
  await UserModel.update({ authId: uid }, { firstName, lastName });

  const newName = `${firstName} ${lastName}`;

  // We only update accounts owned by user that are personal accounts (should only be 1). Merchant display names are not updated.
  await AccountModel.update(
    { id: accountId, isMerchant: false },
    {
      name: newName,
    },
  );

  return await AccountModel.findOneOrFail({
    where: {
      id: accountId,
    },
  });

  // return await User.findOne({
  //   where: {
  //     authId: uid,
  //   },
  // });
};

export async function getUser(id: string): Promise<UserModel> {
  return await UserModel.findOneOrFail(id);
}
// export const updateUser = async(accountId, {data)=>{
//   return await modifyUserProfile("1222dfgbdsf", input);
// }

export async function getUserByAuth(authId: string): Promise<UserModel> {
  return await UserModel.findOneOrFail({ where: { authId } });
}
