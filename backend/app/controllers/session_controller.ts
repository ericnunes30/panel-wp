import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'
import { sessionValidator } from '#validators/session'

export default class SessionController {
    async store({ request }: HttpContext) {
        try {
            const { email, password } = await request.validateUsing(sessionValidator)
            const user = await User.verifyCredentials(email, password)
            const tokenData = await User.accessTokens.create(user)

            // Convertendo para JSON e usando a propriedade 'token' diretamente
            const tokenJson = tokenData.toJSON() as {
                type: string
                name: string | null
                token: string | undefined
                abilities: string[]
                lastUsedAt: Date | null
                expiresAt: Date | null
            }

            const response = {
                token: tokenJson.token,
                user_id: user.id,
                name: user.name
            }

            return response

        } catch (err: any) {
            console.error('Error in session store:', err)
            return {
                error: err.message
            }
        }
    }

    async destroy({ auth }: HttpContext){
        try {
            const user = auth.user!
            const userLogout = User.accessTokens.delete(user, user.currentAccessToken.identifier)

            return userLogout
        } catch (err: any) {
            return {
                error: err.message
            }
        }
    }
}