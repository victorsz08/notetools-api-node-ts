import { Request, Response, NextFunction } from "express"
import { HttpMethod, Route } from "../route.express"
import { AuthSessionUsecase } from "@/usecases/auth/session.usecase"
import { AuthMiddleware } from "@/middleware/auth.middleware"

export class AuthSessionRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly authSessionUsecase: AuthSessionUsecase,
    ) {}

    public static build(authSessionUsecase: AuthSessionUsecase) {
        return new AuthSessionRoute(
            "/auth/session",
            HttpMethod.GET,
            authSessionUsecase,
        )
    }

    public getHandler(): (req: Request, res: Response) => Promise<void> {
        return async (req: Request, res: Response) => {
            const token = req.cookies["nt.authtoken"]
            const output = await this.authSessionUsecase.execute({ token })

            res.status(200).send(output)
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
