import { UserInterface } from "../../domain/interface/user.interface"
import { Usecase } from "../usecase.core"
import { decode, sign } from "jsonwebtoken"
import {
    HttpException,
    HttpStatusCode,
} from "../../package/exceptions/http-exceptions"

export type AuthRefreshInput = {
    token: string
}

export type AuthRefreshOutput = {
    refreshToken: string
}

export class AuthRefreshUsecase
    implements Usecase<AuthRefreshInput, AuthRefreshOutput>
{
    private constructor(private readonly userInterface: UserInterface) {}

    public static build(userInterface: UserInterface) {
        return new AuthRefreshUsecase(userInterface)
    }

    public async execute(input: AuthRefreshInput): Promise<AuthRefreshOutput> {
        const { token } = input

        const userDecoded = decode(token) as { id: string }
        const user = await this.userInterface.find(userDecoded.id)

        if (!user) {
            throw new HttpException(
                HttpStatusCode.NOT_FOUND,
                "Usuário não encontrado",
            )
        }

        const refreshToken = sign(
            {
                id: user.id,
                usename: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
            String(process.env.JWT_SECRET),
            { expiresIn: "7d" },
        )

        return {
            refreshToken: refreshToken,
        }
    }
}
