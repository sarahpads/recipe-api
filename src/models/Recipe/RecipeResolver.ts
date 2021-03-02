import { Resolver, Query, Mutation, Arg, Authorized, Subscription, Root, PubSub, PubSubEngine, FieldResolver, Ctx } from "type-graphql"
import { getRepository } from "typeorm"

import { Recipe } from './Recipe'
import { Favourite, FavouriteResolver } from "../Favourite"
import { CreateRecipeInput } from "./CreateRecipeInput"

@Resolver(of => Recipe)
export class RecipeResolver {
  @Query(type => [Recipe])
  recipes() {
    return Recipe.find()
  }

  @Query(type => Recipe)
  async recipe(@Arg("id") id: string) {
    const recipe = await Recipe.findOne({ where: { id } })

    if (!recipe) {
      throw new Error("Recipe not found")
    }

    return recipe
  }

  @Mutation(type => Recipe)
  async createRecipe(@Arg("data") data: CreateRecipeInput) {
    const recipe = Recipe.create(data)

    await recipe.save()

    return recipe
  }

  @FieldResolver(type => Boolean)
  async isFavourite(@Root() { id }: Recipe, @Ctx() ctx: any) {
    const recipe = await Recipe.createQueryBuilder("recipe")
      .leftJoinAndSelect("recipe.favourites", "favourite", "favourite.user = :user", { user: ctx.uid })
      .where("recipe.id = :id", { id })
      .getOne()

    if (!recipe) {
      throw new Error("Recipe not found")
    }

    return !!recipe.favourites.length
  }

  @FieldResolver(type => Number)
  async numFavourites(@Root() { id }: Recipe) {
    const recipe = await Recipe.createQueryBuilder("recipe")
      .where("recipe.id = :id", { id })
      .leftJoinAndSelect("recipe.favourites", "favourites")
      .getOne()

    if (!recipe) {
      throw new Error("Recipe not found")
    }

    return recipe.favourites.length
  }

  @Mutation(type => Recipe)
  async favourite(@Ctx() ctx: any, @Arg("id") id: string) {
    const recipe = await Recipe.findOne({ where: { id } })
    const favouriteRepository = getRepository(Favourite)

    if (!recipe) {
      throw new Error("Recipe not found")
    }

    const favourite = favouriteRepository.create({
      recipe,
      user: ctx.uid
    })

    await favourite.save()

    return recipe
  }

  @Mutation(type => Recipe)
  async unfavourite(@Ctx() ctx: any, @Arg("id") id: string) {
    const favouriteRepository = getRepository(Favourite)
    const recipe = await Recipe.findOne({ where: { id } })

    if (!recipe) {
      throw new Error("Recipe not found")
    }

    await favouriteRepository.delete({ user: ctx.uid, recipe })

    return  recipe
  }
}