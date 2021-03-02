import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, PrimaryColumn, ManyToOne } from "typeorm"
import { ObjectType, Field, ID } from "type-graphql"

import { Recipe } from "../Recipe"

@Entity()
@ObjectType()
export class Favourite extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string

  @Field(() => String)
  @Column()
  user: string

  @ManyToOne(
    type => Recipe,
    recipe => recipe.favourites
  )
  recipe: Recipe
}