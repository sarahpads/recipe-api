import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, PrimaryColumn } from "typeorm"
import { ObjectType, Field, ID, FieldResolver, Root } from "type-graphql"

import { Favourite } from "../Favourite"

@Entity()
@ObjectType()
export class Recipe extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string

  @Field(() => String)
  @Column()
  title: string

  @Field(() => String)
  @Column()
  image: string

  @Field(() => Number)
  @Column()
  duration: number

  @Field(() => String)
  @Column()
  description: string

  @OneToMany(
    type => Favourite,
    favourite => favourite.recipe
  )
  favourites: Favourite[]
}