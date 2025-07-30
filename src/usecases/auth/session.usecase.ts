import { Role } from "@/domain/enum/role.enum"
import { Usecase } from "../usecase.core"
import { UserInterface } from "@/domain/interface/user.interface"
import { verify } from "jsonwebtoken"
import { UserEntity } from "@/domain/entities/user.entity"
import {
    HttpException,
    HttpStatusCode,
} from "@/package/exceptions/http-exceptions"

export type AuthSessionInput = {
    token: string
}

export type AuthSessionOutput = {
    id: string
    username: string
    firstName: string
    lastName: string
    role: Role
}

export class AuthSessionUsecase
    implements Usecase<AuthSessionInput, AuthSessionOutput>
{
    private constructor(private readonly userRespository: UserInterface) {}

    public static build(userRespository: UserInterface) {
        return new AuthSessionUsecase(userRespository)
    }

    public async execute(input: AuthSessionInput): Promise<AuthSessionOutput> {
        const { token } = input
        const userDecoded = verify(
            token,
            String(process.env.JWT_SECRET),
        ) as UserEntity
        const user = await this.userRespository.find(userDecoded.id)

        if (!user) {
            throw new HttpException(
                HttpStatusCode.NOT_FOUND,
                "Usuário não localizado com esse id",
            )
        }

        return {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        }
    }
}
