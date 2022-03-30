import { ArgsType, InputType, Field } from "type-graphql";

@InputType()
@ArgsType()
export class UpdateProfileInput {
  @Field()
  firstName!: string;

  @Field()
  lastName!: string;
}
