import { ObjectType, Field, registerEnumType, ID } from "type-graphql";
import jwt from "jsonwebtoken";
import { AccountModel } from "../models/account";
import { TransactionResultsType, TransactionType } from "./transaction";

const JWTSECRET = "asdfgkjh345jmsdfg!@#$%fgkjh^*%$ghfdj";

@ObjectType()
export class QRType {
  @Field()
  code: string;

  @Field()
  image: string;
}

@ObjectType()
export class AccountType {
  model: any;

  @Field(() => ID, { nullable: false })
  id?: string;

  @Field({ nullable: false })
  userName: string;

  @Field({ nullable: false })
  displayName: string;

  @Field({ nullable: false })
  image: string;

  @Field()
  isMerchant: boolean;

  @Field()
  type: string;

  @Field(() => Boolean)
  verified: boolean;

  @Field()
  accountToken: string;

  @Field(() => TransactionResultsType)
  transactions: TransactionResultsType;

  @Field(() => Boolean)
  isPrivate?: boolean;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  region: string;

  @Field({ nullable: true })
  phone: string;

  static from(accounts: AccountModel[]): AccountType[] {
    return accounts.map((a: AccountModel) => new AccountType(a));
  }

  constructor(initializer: AccountModel) {
    this.model = JSON.parse(JSON.stringify(initializer));
    this.userName = initializer.username;
    this.isMerchant = !!initializer.isMerchant;
    this.displayName = initializer.name;
    if (initializer.image) {
      this.image = initializer.image;
    } else {
      this.image = `https://ui-avatars.com/api/?background=3B5B7B&color=fff&size=148&name=${initializer.name}`;
    }
    this.type = initializer.isMerchant ? "MERCHANT" : "PERSONAL";
    this.verified = false;
    this.accountToken = jwt.sign({ accountId: initializer.tag }, JWTSECRET);
    this.id = initializer.tag?.toString();
    this.isPrivate = initializer.isPrivate;
    this.city = initializer?.city;
    this.region = initializer?.region;
    this.phone = initializer.phoneNumber ? initializer.phoneNumber : "";
  }
}
