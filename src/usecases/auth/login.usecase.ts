import { UserInterface } from "../../domain/interface/user.interface"
import { Usecase } from "../usecase.core"
import {
    HttpException,
    HttpStatusCode,
} from "../../package/exceptions/http-exceptions"
import { Hash } from "../../patterns/hash"
import { sign } from "jsonwebtoken"

export type AuthLoginInput = {
    username: string
    password: string
}

export type AuthLoginOutput = {
    token: string
}

export class AuthLoginUsecase
    implements Usecase<AuthLoginInput, AuthLoginOutput>
{
    private constructor(private readonly userRepository: UserInterface) {}

    public static build(userRepository: UserInterface) {
        return new AuthLoginUsecase(userRepository)
    }

    public async execute(input: AuthLoginInput): Promise<AuthLoginOutput> {
        const { username, password } = input
        const user = await this.userRepository.findByUsername(username)

        if (!user) {
            throw new HttpException(
                HttpStatusCode.BAD_REQUEST,
                "Username ou senha incorretos",
            )
        }

        const validatePassword = await Hash.compare(password, user.password)

        if (!validatePassword) {
            throw new HttpException(
                HttpStatusCode.BAD_REQUEST,
                "Username ou senha incorretos",
            )
        }

        const payload = sign(
            {
                id: user.id,
                role: user.role,
            },
            String(process.env.JWT_SECRET),
            { expiresIn: "15m" },
        )

        return {
            token: payload,
        }
    }
}
