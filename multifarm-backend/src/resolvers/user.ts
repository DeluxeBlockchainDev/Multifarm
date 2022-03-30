import { Resolver, Query, Mutation, Arg, Ctx, Args } from "type-graphql";
import { Context } from "../app";
import { AccountType } from "../schemas/account";
import { UpdateProfileInput } from "../inputs/user";
import { getUser, getUserByAuth, modifyUserProfile } from "../services/user";
import { UserType } from "../schemas/user";

@Resolver(of => UserType)
export class UserResolver {
  @Query(() => UserType)
  async user(@Arg("id") id: string): Promise<UserType> {
    const user = await getUser(id);
    return new UserType(user);
  }

  @Query(() => UserType)
  async myUserProfile(@Ctx() ctx: Context): Promise<UserType> {
    const user = await getUserByAuth(ctx.user.uid);
    return new UserType(user);
  }

  @Mutation(() => AccountType)
  async modifyUserProfile(
    @Args() input: UpdateProfileInput,
    @Ctx() ctx: Context,
  ): Promise<AccountType> {
    const account = await modifyUserProfile(ctx.user.uid, ctx.accountId, input);
    return new AccountType(account);
  }
}
