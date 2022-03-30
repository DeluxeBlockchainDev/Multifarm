import { Geometry } from "geojson";
import { createQueryBuilder } from "typeorm";
import { AccountModel } from "../../models/account";
import { UserModel } from "../../models/user";
import {
  CreateUserInput,
  UpdateUserInput,
} from "../../inputs/account";

export default async (accountId: number): Promise<AccountModel> => {
  return await AccountModel.findOneOrFail(accountId, {
    relations: ["country"],
  }).catch(errr => {
    throw new Error("Account not found");
  });
};

/**
 *  Get list of accounts that have membership to user with passed in authId
 * @param authId User Authentication ID
 */
export async function getAccounts(authId: string): Promise<AccountModel[]> {
  const accounts = await AccountModel.createQueryBuilder("account")
    .leftJoin(MembershipModel, "membership", "membership.fk_account_id = account.id")
    .leftJoin(UserModel, "user", "membership.fk_uid = user.id")
    .where("user.auth_id = :authId", { authId })
    .getMany();
  return accounts;
}

export const updateAccount = async (
  input: UpdateUserInput,
  accountId: number,
  userId: string,
): Promise<AccountModel> => {
  const accountToEdit = await AccountModel.findOneOrFail({
    where: { id: accountId, isMerchant: false },
  }).catch(error => {
    console.error("Merchant account edited as personal account", input, accountId, userId);
    throw new Error("!Personal account");
  });
  const userToEdit = await UserModel.findOneOrFail({ where: { authId: userId } }).catch(err => {
    throw new Error("User not found");
  });
  if (input.firstName && input.lastName) {
    if (input.firstName.trim().length < 1 || input.lastName.trim().length < 1) {
      throw new Error("Name inputs too short");
    } else {
      UserModel.update(
        { authId: userId },
        {
          firstName: input.firstName,
          lastName: input.lastName,
        },
      ).catch(error => {
        throw new Error("User Not edited");
      });
      const edited = await AccountModel.update(
        { id: accountId },
        {
          name: `${input.firstName ? input.firstName : userToEdit.lastName} ${
            input.lastName ? input.lastName : userToEdit.lastName
          }`,
          isPrivate: input.isPrivate ? input.isPrivate : accountToEdit.isPrivate,
          country: input.country
            ? await CountryModel.findOneOrFail({ where: { alpha2: input.country.toLowerCase() } })
            : accountToEdit.country,
          phoneNumber: input.phone ? input.phone : accountToEdit.phoneNumber,
          city: input.city ? input.city : accountToEdit.city,
          region: input.region ? input.region : accountToEdit.region,
        },
      ).catch(error => {
        throw new Error("Account could not be edited");
      });
      return await AccountModel.findOneOrFail(accountId).catch(err => {
        throw new Error("Account not found");
      });
    }
  } else if (!input.firstName && !input.lastName) {
    const edited = await AccountModel.update(
      { id: accountId },
      {
        // username: input.userName ? input.userName : accountToEdit.username,
        country: input.country
          ? await CountryModel.findOneOrFail({ where: { alpha2: input.country.toLowerCase() } })
          : accountToEdit.country,
        phoneNumber: input.phone ? input.phone : accountToEdit.phoneNumber,
        city: input.city ? input.city : accountToEdit.city,
        region: input.region ? input.region : accountToEdit.region,
      },
    ).catch(error => {
      throw new Error("Account could not be edited");
    });
    return await AccountModel.findOneOrFail(accountId).catch(err => {
      throw new Error("Account not found");
    });
  } else throw new Error("Name inputs too short");
};

export const findAccounts = async (
  searchString: string,
  merchant = false,
  geom?: Geometry,
): Promise<AccountModel[]> => {
  if (searchString.length === 0) {
    return [];
  }
  const foundAccounts = await AccountModel.createQueryBuilder("account")
    .where(`account.name ILIKE :searchString`, { searchString: `%${searchString}%` })
    .orWhere(`account.username ILIKE :searchString`, { searchString: `%${searchString}%` })
    .andWhere("account.is_merchant = :merchant", { merchant: true })
    .limit(20)
    .orderBy("account.name", "ASC")
    .addOrderBy("account.username", "ASC")
    .getMany();
  return foundAccounts;
};

export const getAccountByUsername = async (username: string): Promise<AccountModel | undefined> => {
  const foundAccount = await await AccountModel.findOneOrFail({
    where: { username, isPrivate: false },
    relations: ["country"],
  }).catch(err => {
    throw new Error("Account Not Found");
  });
  return foundAccount;
};

export const getAccountByTag = async (id: string): Promise<AccountModel> => {
  const account = await AccountModel.createQueryBuilder("account")
    .where({ tag: id })
    .getOneOrFail();
  return account;
};

export const getAccountById = async (id: number): Promise<AccountModel> => {
  return await AccountModel.createQueryBuilder("account").where({ id }).getOneOrFail();
};

export const isUsernameAvailable = async (keyword: string): Promise<boolean> => {
  if (isUsernameOnBlacklist(keyword)) {
    return false;
  }
  const exists = await createQueryBuilder(AccountModel)
    .where("LOWER(username) = :keyword", { keyword: keyword.toLowerCase() })
    .getCount();
  return !!!exists;
};

export const createUserAccount = async ({
  firstName,
  lastName,
  userName,
  email,
  password,
  city,
  country,
  phone,
  region,
}: CreateUserInput): Promise<string> => {
  const usernameAvailable = await isUsernameAvailable(userName);
  if (isUsernameOnBlacklist(userName) || !usernameAvailable) {
    throw new Error("Username Unavailable");
  }

  if (firstName.length < 1 || lastName.length < 1) {
    throw new Error("Length of name parameter not long enough");
  }

  const account: AccountModel = new AccountModel();
  account.isMerchant = false;
  // We set up the "display name" on the account as first name last name initial.
  // Possible to use joins later on from user or merchant profile, but this allows us to use this entity without relying on additional joins
  account.name = `${firstName} ${lastName}`;
  account.username = userName;
  account.isPrivate = false;
  account.phoneNumber = phone ? phone : undefined;
  account.city = city ? city : undefined;
  if (country) {
    const foundCountry = await CountryModel.findOneOrFail({
      where: { alpha2: country.toLowerCase() },
    }).catch(err => {
      console.log("Country could not be found. ");
    });
    if (foundCountry) {
      account.country = foundCountry;
    }
  }
  account.region = region ? region : "";

  // Create firebase user based on passed in params
  const firebaseUser = await createFirebaseUser(email, password).catch(err => {
    throw new Error(err);
  });

  const user = new UserModel();
  user.authId = firebaseUser.uid;
  user.firstName = firstName;
  user.lastName = lastName;

  // Every user has a membership between their user and their "account". Currently this is just extra, but it allows the ability for a user to also have a merchant account later on.
  const membership = new MembershipModel();
  membership.role = "user";
  membership.account = account;
  membership.user = user;

  await user.save();
  const savedAccount = await account.save();
  await membership.save();

  // TODO: Create standard Wyre Wallet for user? Talk to Wyre service.
  // const wallet = new Wallet();
  // wallet.account = savedAccount;
  // wallet.walletPlatform = "wyre";
  // wallet.walletId = "12345asdfg";
  // await wallet.save();

  // We return custom auth token to FE that they can use to sign in their user
  const customAuthToken = await getCustomFirebaseToken(firebaseUser.uid);
  return customAuthToken;
};