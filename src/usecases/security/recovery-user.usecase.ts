import { UserInterface } from "../../domain/interface/user.interface"
import { Usecase } from "../usecase.core"
import {
    HttpException,
    HttpStatusCode,
} from "../../package/exceptions/http-exceptions"
import { Hash } from "../../patterns/hash"
import { DatePattern } from "../../patterns/date"

export type RecoveryUserInput = {
    id: string
}

export type RecoveryUserOutput = {
    newPassword: string
}

export class RecoveryUserUsecase
    implements Usecase<RecoveryUserInput, RecoveryUserOutput>
{
    private constructor(private readonly userInterface: UserInterface) {}

    public static build(userInterface: UserInterface) {
        return new RecoveryUserUsecase(userInterface)
    }

    public async execute(
        input: RecoveryUserInput,
    ): Promise<RecoveryUserOutput> {
        const { id } = input
        const user = await this.userInterface.find(id)
        const updatedAt = DatePattern.getCurrentDate()

        if (!user) {
            throw new HttpException(
                HttpStatusCode.NOT_FOUND,
                "Usuário não localizado com esse id",
            )
        }

        const randomPassword = Math.random().toString(30).slice(-10)
        const newPasswordHashed = await Hash.hash(randomPassword)

        await this.userInterface.changePassword(
            id,
            newPasswordHashed,
            updatedAt,
        )
        return {
            newPassword: randomPassword,
        }
    }
}
