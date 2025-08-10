import { UserInterface } from "../../domain/interface/user.interface"
import { Usecase } from "../usecase.core"
import {
    HttpException,
    HttpStatusCode,
} from "../../package/exceptions/http-exceptions"

export type DeleteUserInput = {
    id: string
}

export type DeleteUserOutput = void

export class DeleteUserUsecase
    implements Usecase<DeleteUserInput, DeleteUserOutput>
{
    private constructor(private readonly userRepository: UserInterface) {}

    public static build(userRepository: UserInterface) {
        return new DeleteUserUsecase(userRepository)
    }

    public async execute(input: DeleteUserInput): Promise<void> {
        const { id } = input
        const user = await this.userRepository.find(id)

        if (!user)
            throw new HttpException(
                HttpStatusCode.NOT_FOUND,
                "usuário não encontrado com esse id",
            )
        await this.userRepository.delete(id)

        return
    }
}
