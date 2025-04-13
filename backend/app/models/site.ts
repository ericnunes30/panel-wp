import { DateTime } from 'luxon'
import { BaseModel, beforeSave, belongsTo, column, computed } from '@adonisjs/lucid/orm'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import encryption from '@adonisjs/core/services/encryption'
import User from './user.js'

export default class Site extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare url: string

  @column({ serializeAs: null })
  declare api_key: string

  @column()
  declare status: boolean

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  public static async encryptApiKey(site: Site) {
    if (site.$dirty.api_key) {
      site.api_key = encryption.encrypt(site.api_key)
    }
  }

  @computed()
  get apiKey(): string | null {
    return this.getDecryptedApiKey()
  }

  public getDecryptedApiKey(): string | null {
    return this.api_key ? encryption.decrypt(this.api_key) : null
  }
}
