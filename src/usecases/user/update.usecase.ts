import { UserInterface } from "../../domain/interface/user.interface"
import { Usecase } from "../usecase.core"
import {
    HttpException,
    HttpStatusCode,
} from "../../package/exceptions/http-exceptions"
import { DatePattern } from "../../patterns/date"

export type UpdateUserInput = {
    id: string
    username: string
    firstName: string
    lastName: string
}

export type UpdateUserOutput = void

export class UpdateUserUsecase
    implements Usecase<UpdateUserInput, UpdateUserOutput>
{
    private constructor(private readonly userRepository: UserInterface) {}

    public static build(userRepository: UserInterface) {
        return new UpdateUserUsecase(userRepository)
    }
    public async execute(input: UpdateUserInput): Promise<void> {
        const { id, username, firstName, lastName } = input
        const user = await this.userRepository.find(id)
        const updatedAt = DatePattern.getCurrentDate()

        if (!user)
            throw new HttpException(
                HttpStatusCode.NOT_FOUND,
                "usuário não encontrado com esse id",
            )

        if (username !== user.username) {
            const userExists =
                await this.userRepository.findByUsername(username)
            if (userExists)
                throw new HttpException(
                    HttpStatusCode.CONFLICT,
                    "já existe um usuário com esse username",
                )
        }

        await this.userRepository.update(
            id,
            username,
            firstName,
            lastName,
            updatedAt,
        )
        return
    }
}
