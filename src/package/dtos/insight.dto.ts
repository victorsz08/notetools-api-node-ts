import { z } from "zod"

export const getInsightDto = z.object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
})
