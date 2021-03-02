import { InputType, Field } from "type-graphql"

@InputType()
export class CreateRecipeInput {
  @Field()
  title: string

  @Field()
  duration: number

  @Field()
  description: string

  @Field()
  image: string
}