import knex from 'knex'
import { ViteSeedSource } from './source'

export interface QueryError extends Error {
  code: string
  errno: number
}

export const Database = async (filename: string) => {
  const database = knex({
    client: 'sqlite',
    connection: { filename },
    migrations: {
      directory: [],
    },
    seeds: {
      seedSource: new ViteSeedSource(),
    },
    useNullAsDefault: false,
  })
  // run seeders & migrations
  await Promise.resolve()
    .then(async () => await database.seed.run())
    .then(async () => await database.migrate.latest())
  // return database
  return database
}

export default Database
