import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'

import { createUserValidator, updateUserValidator } from '#validators/user'

export default class UsersController {
  // read many
  async index() {
    try {      
      const users = await User.query().preload('sites')

      const userFormat = users.map((user) => {

        const sitesFormat = user.sites.map((site) => ({
          id: site.id,
          name: site.name,
          url: site.url,
          apiKey: site.apiKey
        }))

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          sites: sitesFormat
        }
      })

      return userFormat 
    } catch (err:any) {
      return {
        error: err.message
      }
    }
  }

  // create
  async store({ request }: HttpContext) {
    try {
      const { name, email, password } = await request.validateUsing(createUserValidator)
      const user = await User.create({name, email, password})
      return user
    } catch (err: any) {
      return {
        error: err.message
      }
    }
  }

  // READ
  async show({ params, response }: HttpContext) {
    try {
      const user = await User.findByOrFail('id', params.id)
      await user.load('sites')

      const sitesFormat = user.sites.map((site) => ({
        id: site.id,
        name: site.name,
        url: site.url,
        apiKey: site.apiKey
      }))

      const userFormat = {
        id: user.id,
        name: user.name,
        email: user.email,
        sites: sitesFormat
      }

      return userFormat 
    } catch (error) {
      return response.status(400).json({error: "User not found!"})
    }
  }

  // update
  async update({ params, request, response }: HttpContext) {
    try {
      const user = await User.findByOrFail('id', params.id)
      const { name, password  } = await request.validateUsing(updateUserValidator)
      user.merge({  name, password  })
      await user.save()
      return user
    } catch (error) {
      return response.status(400).json({error: "User not found!"})
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const user = await User.findByOrFail('id', params.id)
      await user.delete()
      return response.status(203)
    } catch (error) {
      return response.status(400).json({error: "User not found!"})
    }
  }
}