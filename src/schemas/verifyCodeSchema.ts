import { z } from "zod";

export const verifyCodeSchema = z.object({
    code:z.string().length(6,'Verfication code must of 6 characters')
})
