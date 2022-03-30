import { Geometry } from "geojson";
import { ArgsType, InputType, Field, Int, Float } from "type-graphql";

@InputType()
export class ImageDimensions {
  @Field(() => Int)
  x: number;

  @Field(() => Int)
  y: number;

  @Field(() => Int)
  w: number;

  @Field(() => Int)
  h: number;
}

@InputType()
export class GeometricSearchInput {
  @Field(() => [Float])
  firstCoordinate: Float32Array[];

  @Field(() => [Float])
  secondCoordinate: Float32Array[];
}

@InputType()
export class UpdateAccountImageInput {
  @Field()
  imageUrl: string;

  @Field(() => ImageDimensions)
  dimensions?: ImageDimensions;
}

@InputType()
@ArgsType()
export class CreateUserInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  userName: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  phone: string;

  @Field()
  country: string;

  @Field()
  city: string;

  @Field()
  region: string;
}

@InputType()
@ArgsType()
export class UpdateUserInput {
  @Field()
  firstName?: string;

  @Field()
  lastName?: string;

  // @Field()
  // userName?: string;

  @Field()
  phone: string;

  @Field()
  country: string;

  @Field()
  city: string;

  @Field()
  region: string;

  @Field()
  isPrivate: boolean;
}

// export enum AccountCategory {
//   MERCHANT,
//   PERSONAL,
// }

// registerEnumType(AccountCategory, {
//   name: "AccountCategory",
// });
