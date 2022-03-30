import { Field, ObjectType } from "type-graphql";
import { UserModel } from "../models/user";

@ObjectType()
export class UserType {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  fullName: string;

  @Field()
  createdOn: string;

  constructor(initializer: UserModel) {
    this.firstName = initializer.firstName;
    this.lastName = initializer.lastName;
    this.fullName = `${initializer.firstName} ${initializer.lastName}`;
    this.createdOn = initializer.createdOn?.toString();
  }
}
