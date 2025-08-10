import { Request, Response, NextFunction } from "express"
import { HttpMethod, Route } from "../route.express"
import { AuthLoginUsecase } from "../../../../../usecases/auth/login.usecase"
import { Validation } from "../../../../../middleware/validate-schema"
import { authLoginDto } from "../../../../../package/dtos/auth.dto"

export class AuthLoginRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly authLoginUsecase: AuthLoginUsecase,
    ) {}

    public static build(authLoginUsecase: AuthLoginUsecase) {
        return new AuthLoginRoute(
            "/auth/login",
            HttpMethod.POST,
            authLoginUsecase,
        )
    }

    public getHandler(): (req: Request, res: Response) => Promise<void> {
        return async (req: Request, res: Response) => {
            const output = await this.authLoginUsecase.execute(req.body)
            res.cookie("nt.authtoken", output.token, {
                httpOnly: true,
                secure: true,
                maxAge: 60 * 60 * 24, // 1 dia
                path: "/",
                sameSite: "none",
            })

            res.status(200).send()
        }
    }

    public getPath(): string {
        return this.path
    }

    public getMethod(): HttpMethod {
        return this.method
    }
    getMiddleware(): ((
        request: Request,
        response: Response,
        next: NextFunction,
    ) => Promise<void>)[] {
        return [Validation(authLoginDto)]
    }
}
