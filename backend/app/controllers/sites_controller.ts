import type { HttpContext } from '@adonisjs/core/http'

import { createSiteValidator, updateSiteValidator } from '#validators/site'
import Site from '#models/site'

export default class SitesController {
  /**
   * Exibir uma lista de recursos
   */
  async index({ auth }: HttpContext) {    
    try {      
      const user = auth.user!
      await user.preload('sites')

      const sites = user.sites.map((site) => ({  
        id: site.id,
        name:site.name,
        url: site.url,
        apiKey: site.apiKey
       }))

      return sites
    } catch (err: any) {
      return {
        error: err.message
      }
    }
  }

  /**
   * Lidar com o envio do formulário para a ação de criação
   */
  async store({ request, auth }: HttpContext) {
    try {
      const { name, url, api_key } = await request.validateUsing(createSiteValidator)
      const user = auth.user!

      const siteCreate = await user.related('sites').create({ name, url, api_key })
      return siteCreate
    } catch (err: any) {
      return {
        error: err.message
      }
    }
  }

  /**
   * Mostrar registro individual
   */
  async show({ params, response }: HttpContext) {
    try {
      const site = await Site.findByOrFail('id', params.id)
      
      const siteFormat = {
        id: site.id,
        name: site.name,
        url: site.url,
        apiKey: site.apiKey
      } 

      return siteFormat
    } catch (err: any) {
      return {
        error: err.message
      } 
    }
  }

  /**
   * Lidar com o envio do formulário para a ação de edição
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const site = await Site.findByOrFail('id', params.id)
      const { name, url, api_key } = await request.validateUsing(updateSiteValidator)

      site.merge({ name, url, api_key })
      await site.save()

      return site
    } catch (err: any) {
      return {
        error: err.message
      }
    }
  }

  /**
   * Excluir registro
   */
  async destroy({ params }: HttpContext) {
    try {
      
      const site = await Site.findByOrFail('id', params.id)
      const siteDelete = await site.delete() 
      
      return siteDelete

    } catch (err: any) {
      return {
        error: err.message
      } 
    }
  }
}