import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        email: "ericcontato.nunes@gmail.com",
        name: "Admin1",
        password: "secret"
      },
      {
        email: "nunes@gmail.com",
        name: "usuario1",
        password: "secret"
      }
    ])
  }
}