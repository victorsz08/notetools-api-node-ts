import { z } from "zod"

export const createNoteDto = z.object({
    title: z
        .string()
        .nonempty("o campo titulo não pode ser vazio")
        .default("Nova anotação"),
    content: z.string().nonempty(),
})

export const updateNoteDto = z.object({
    title: z
        .string()
        .nonempty("o campo titulo não pode ser vazio")
        .default("Nova anotação"),
    content: z.string().nonempty(),
})

export const listNoteDto = z.object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10),
})
