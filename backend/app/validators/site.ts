import vine from '@vinejs/vine'

export const createSiteValidator = vine.compile(
    vine.object({
        name: vine.string().trim().minLength(3),
        url: vine.string().trim().minLength(3),
        api_key: vine.string().trim().minLength(3),
    })
)

export const updateSiteValidator = vine.compile(
    vine.object({
        name: vine.string().trim().minLength(3).optional(),
        url: vine.string().trim().minLength(3).optional(),
        api_key: vine.string().trim().minLength(3).optional(),
    })
)