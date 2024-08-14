import {z} from 'zod'

export const acceptMsg = z.object({
    acceptMessages : z .boolean().default(true)
})
