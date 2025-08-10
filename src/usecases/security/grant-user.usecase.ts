import { Role } from "../../domain/enum/role.enum"
import { Usecase } from "../usecase.core"
import { UserInterface } from "../../domain/interface/user.interface"
import {
    HttpException,
    HttpStatusCode,
} from "../../package/exceptions/http-exceptions"

export type GrantUserInput = {
    id: string
    role: Role
}

export type GrantUserOutput = void

export class GrantUserUsecase
    implements Usecase<GrantUserInput, GrantUserOutput>
{
    private constructor(private readonly userRepository: UserInterface) {}

    public static build(userRepository: UserInterface) {
        return new GrantUserUsecase(userRepository)
    }

    public async execute(input: GrantUserInput): Promise<void> {
        const { id, role } = input
        const user = await this.userRepository.find(id)

        if (!user) {
            throw new HttpException(
                HttpStatusCode.NOT_FOUND,
                "Usuário não encontrado com esse id",
            )
        }

        await this.userRepository.grantUser(id, role)
        return
    }
}
