import "reflect-metadata"
import { createConnection } from "typeorm"
import { ApolloServer } from "apollo-server"
import { buildSchema } from "type-graphql"

import { RecipeResolver, Recipe } from "./models/Recipe"
import { FavouriteResolver, Favourite } from "./models/Favourite"

async function main() {
  await createConnection({
    type: "postgres",
    database: "recipe-app",
    username: "postgres",
    host: "localhost",
    port: 6543,
    entities: [
      Recipe,
      Favourite
    ],
    synchronize: true,
    logging: true
  })

  const schema = await buildSchema({
    resolvers: [
      RecipeResolver,
      FavouriteResolver
    ],
    validate: () => {}
  })

  const server = new ApolloServer({
    schema,
    context: async ({ req, connection }) => {
      if (connection) {
        return
      }

      const user = req.headers["recipe-app-user"]

      if (!user) {
        return
      }

      return {
        uid: user
      }
    }
  })

  const info = await server.listen(6006)

  console.log(`Server has started on port ${info.port}`)
}

main()