import { z } from "zod"

export const createUserDto = z.object({
    username: z
        .string()
        .nonempty("O campo não pode ser vazio")
        .min(4, "O username deve conter no mínimo 4 caracteres")
        .trim(),
    firstName: z
        .string()
        .nonempty("O campo não pode ser vazio")
        .min(4, "O nome deve conter no mínimo 4 caracteres")
        .trim(),
    lastName: z
        .string()
        .nonempty("O campo não pode ser vazio")
        .min(4, "O o sobrenome deve conter no mínimo 4 caracteres")
        .trim(),
    password: z
        .string()
        .min(8, "A senha deve ter no mínimo 8 caracteres")
        .max(20, "A senha deve ter no máximo 20 caracteres")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial",
        ),
})

export const updateUserDto = z.object({
    username: z
        .string()
        .nonempty("O campo não pode ser vazio")
        .min(4, "O username deve conter no mínimo 4 caracteres")
        .trim(),
    firstName: z
        .string()
        .nonempty("O campo não pode ser vazio")
        .min(4, "O nome deve conter no mínimo 4 caracteres")
        .trim(),
    lastName: z
        .string()
        .nonempty("O campo não pode ser vazio")
        .min(4, "O o sobrenome deve conter no mínimo 4 caracteres")
        .trim(),
})

export const changePasswordDto = z.object({
    currentPassword: z.string().nonempty("o campo não pode ser vazio"),
    newPassword: z
        .string()
        .min(8, "A senha deve ter no mínimo 8 caracteres")
        .max(20, "A senha deve ter no máximo 20 caracteres")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial",
        ),
})
