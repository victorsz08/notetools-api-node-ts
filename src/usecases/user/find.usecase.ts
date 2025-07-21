import { UserInterface } from "@/domain/interface/user.interface"
import { Usecase } from "../usecase.core"
import {
    HttpException,
    HttpStatusCode,
} from "@/package/exceptions/http-exceptions"
import { UserEntity } from "@/domain/entities/user.entity"

export type FindUserInput = {
    id: string
}

export type FindUserOutput = {
    id: string
    username: string
    firstName: string
    lastName: string
    role: string
    createdAt: Date
    updatedAt: Date
}

export class FindUserUsecase implements Usecase<FindUserInput, FindUserOutput> {
    private constructor(private readonly userRepository: UserInterface) {}

    public static build(userRepository: UserInterface) {
        return new FindUserUsecase(userRepository)
    }

    public async execute(input: FindUserInput): Promise<FindUserOutput> {
        const { id } = input
        const user = await this.userRepository.find(id)

        if (!user) {
            throw new HttpException(
                HttpStatusCode.NOT_FOUND,
                "usuário não encontrado com esse id",
            )
        }

        const output = this.present(user)
        return output
    }

    private present(user: UserEntity): FindUserOutput {
        return {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    }
}
