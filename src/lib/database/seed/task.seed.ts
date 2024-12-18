import type { Knex } from 'knex'

export const seed = async (knex: Knex) => {
  if (await knex.schema.hasTable('task')) {
    return
  }
  return knex.schema.createTable('task', (table) => {
    table.increments('id', { primaryKey: true })
    table.string('name').notNullable().unique()
    table.string('path').notNullable()
    table.boolean('enabled').notNullable()
    table.integer('interval').notNullable()
    table.unique(['name', 'path'])
  })
}
