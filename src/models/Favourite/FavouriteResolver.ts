import { Resolver, Query, Mutation, Arg, Authorized, Subscription, Root, PubSub, PubSubEngine, FieldResolver } from "type-graphql"
import { getRepository } from "typeorm"

import { Favourite } from "./Favourite"

@Resolver(of => Favourite)
export class FavouriteResolver {
  @Query(() => [Favourite])
  favourites() {
    return Favourite.find()
  }

  @Query(type => Favourite)
  async recipe(@Arg("id") id: string) {
    const recipe = await Favourite.findOne({ where: { id } })

    if (!recipe) {
      throw new Error("Recipe not found")
    }

    return recipe
  }

}