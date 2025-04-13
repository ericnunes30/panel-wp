import vine from '@vinejs/vine'

export const sessionValidator = vine.compile(
    vine.object({
        email: vine.string().email().email().normalizeEmail(),
        password: vine.string().minLength(6)
    })
)