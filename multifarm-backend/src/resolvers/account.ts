import {
  Resolver,
  Arg,
  Args,
  Ctx,
  Root,
  Query,
  Mutation,
  FieldResolver,
  Float,
} from "type-graphql";

import getAccount, {
  findAccounts,
  getAccountByUsername,
  getAccountByTag,
  updateAccount,
  isUsernameAvailable,
  createUserAccount,
  getAccounts,
} from "../services/account";
import { AccountType } from "../schemas/account";
import { Context } from "../app";
import {
  CreateUserInput,
  UpdateUserInput,
} from "../inputs/account";

@Resolver(() => AccountType)
export class AccountResolver {
  @Query(() => AccountType, { description: "Get current users selected account", nullable: false })
  async me(@Ctx() ctx: Context): Promise<AccountType> {
    const me = await getAccount(ctx.accountId);
    return new AccountType(me);
  }

  @Query(() => AccountType, { nullable: true, description: "Get account by username" })
  async account(@Arg("username") username: string): Promise<AccountType | null> {
    const account = await getAccountByUsername(username);
    if (account) {
      return new AccountType(account);
    }
    return null;
  }

  @Query(() => [AccountType], {
    description: "Get list of accounts that current user has access to",
  })
  async accounts(@Ctx() ctx: Context): Promise<AccountType[]> {
    const accounts = await getAccounts(ctx.user.uid);
    return AccountType.from(accounts);
  }

  @Query(() => AccountType, { nullable: false })
  async accountById(@Arg("id") id: string): Promise<AccountType> {
    const account = await getAccountByTag(id);
    return new AccountType(account);
  }

  @Query(() => [AccountType])
  async searchAccounts(@Arg("searchString") searchString: string): Promise<AccountType[]> {
    const accounts = await findAccounts(searchString, false);
    return AccountType.from(accounts);
  }

  @Query(() => Boolean)
  async isUsernameAvailable(@Arg("keyword") keyword: string): Promise<boolean> {
    return await isUsernameAvailable(keyword);
  }

  @Mutation(() => AccountType)
  async updateAccount(@Args() input: UpdateUserInput, @Ctx() ctx: Context): Promise<AccountType> {
    const account = await updateAccount(input, ctx.accountId, ctx.user.uid);
    return new AccountType(account);
  }

  @Mutation(() => String)
  async createNewUser(@Args() input: CreateUserInput, @Ctx() ctx: Context): Promise<string> {
    return await createUserAccount(input);
  }
}
