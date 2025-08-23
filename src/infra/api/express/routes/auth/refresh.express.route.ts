import { Request, Response, NextFunction } from "express"
import { HttpMethod, Route } from "../route.express"
import { AuthRefreshUsecase } from "../../../../../usecases/auth/refresh.usecase"
import { AuthMiddleware } from "../../../../../middleware/auth.middleware"

export class AuthRefreshRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly authRefreshUsecase: AuthRefreshUsecase,
    ) {}

    public static build(authRefreshUsecase: AuthRefreshUsecase) {
        return new AuthRefreshRoute(
            "/auth/refresh",
            HttpMethod.POST,
            authRefreshUsecase,
        )
    }

    public getHandler(): (req: Request, res: Response) => Promise<void> {
        return async (req: Request, res: Response) => {
            const token = req.cookies["nt.authtoken"]
            const refresh = await this.authRefreshUsecase.execute({ token })

            res.cookie("nt.authtoken", refresh.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 604800000, // 7 days
                path: "/",
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

    public getMiddleware(): ((
        request: Request,
        response: Response,
        next: NextFunction,
    ) => Promise<void>)[] {
        return [AuthMiddleware()]
    }
}
