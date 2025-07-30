import z from "zod"

export const authLoginDto = z.object({
    username: z.string().nonempty("o campo username é obrigatório"),
    password: z.string().nonempty("o campo username é obrigatório"),
})
