import { Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

// you can mess with the types here
// for example, if I don't want to give the possibility of queryng title I can just remove the @Field
// and with that the title will not be exposed in the schema

@ObjectType()
@Entity()
export class Post {
  // TypeORM v5 requires this
  [OptionalProps]?: "updatedAt" | "createdAt"; // id is there automatically

  @Field(() => Int)
  @PrimaryKey({ type: "number" })
  id!: number;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt: Date = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Field(() => String)
  @Property({ type: "text" })
  title!: string;
}
