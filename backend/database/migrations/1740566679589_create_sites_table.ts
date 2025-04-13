import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sites'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('url').notNullable()
      table.string('api_key').notNullable()
      table.boolean('status').nullable().defaultTo(false)

      table.integer('user_id').notNullable().unsigned().references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}