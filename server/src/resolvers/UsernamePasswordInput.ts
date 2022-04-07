import { Field, InputType } from "type-graphql";

// import { EntityManager } from "@mikro-orm/postgresql";
// using input types
@InputType()
export class UsernamePasswordInput {
  @Field(() => String)
  email!: string;
  @Field(() => String)
  username!: string;
  @Field(() => String)
  password!: string;
}
