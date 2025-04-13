import Site from '#models/site'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Site.createMany([
      {
        name: "Admin1",
        url: "site.com",
        api_key: "123456",
        userId: 1
      }
    ])
  }
}