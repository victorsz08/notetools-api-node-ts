import { UserInterface } from "@/domain/interface/user.interface"
import { Usecase } from "../usecase.core"
import {
    HttpException,
    HttpStatusCode,
} from "@/package/exceptions/http-exceptions"
import { Hash } from "@/patterns/hash"
import { DatePattern } from "@/patterns/date"

export type ChangePasswordInput = {
    id: string
    currentPassword: string
    newPassword: string
}

export type ChangePasswordOutput = void

export class ChangePasswordUsecase
    implements Usecase<ChangePasswordInput, ChangePasswordOutput>
{
    private constructor(private readonly userRepository: UserInterface) {}

    public static build(userRepository: UserInterface) {
        return new ChangePasswordUsecase(userRepository)
    }

    public async execute(input: ChangePasswordInput): Promise<void> {
        const { id, currentPassword, newPassword } = input
        const user = await this.userRepository.find(id)
        const updatedAt = DatePattern.getCurrentDate()

        if (!user)
            throw new HttpException(
                HttpStatusCode.NOT_FOUND,
                "usuário não encontrado com esse id",
            )

        const validatePassword = await Hash.compare(
            currentPassword,
            user.password,
        )
        if (!validatePassword)
            throw new HttpException(
                HttpStatusCode.UNAUTHORIZED,
                "senha atual inválida",
            )

        const hashedPassword = await Hash.hash(newPassword)
        await this.userRepository.changePassword(id, hashedPassword, updatedAt)

        return
    }
}
