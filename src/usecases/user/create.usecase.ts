import { UserEntity } from "@/domain/entities/user.entity"
import { UserInterface } from "@/domain/interface/user.interface"
import {
    HttpException,
    HttpStatusCode,
} from "@/package/exceptions/http-exceptions"
import { Usecase } from "@/usecases/usecase.core"

export type CreateUserInput = {
    username: string
    fistName: string
    lastName: string
    password: string
}

export type CreateUserOutput = void

export class CreateUserUsecase
    implements Usecase<CreateUserInput, CreateUserOutput>
{
    private constructor(private readonly userRepository: UserInterface) {}

    public static build(userRepository: UserInterface) {
        return new CreateUserUsecase(userRepository)
    }

    public async execute(input: CreateUserInput): Promise<void> {
        const { username, fistName, lastName, password } = input
        const usernameAlreadyExists =
            await this.userRepository.findByUsername(username)

        if (usernameAlreadyExists) {
            throw new HttpException(
                HttpStatusCode.BAD_REQUEST,
                "username indisponível",
            )
        }

        const user = await UserEntity.build(
            username,
            fistName,
            lastName,
            password,
        )
        await this.userRepository.create(user)

        return
    }
}
