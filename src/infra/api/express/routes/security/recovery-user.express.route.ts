import { Request, Response, NextFunction } from "express"
import { HttpMethod, Route } from "../route.express"
import { RecoveryUserUsecase } from "../../../../../usecases/security/recovery-user.usecase"
import { AuthMiddleware } from "../../../../../middleware/auth.middleware"
import { GuardMiddleware } from "../../../../../middleware/guard.middleware"
import { Role } from "../../../../../domain/enum/role.enum"

export class RecoveryUserRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly recoverUseruseacse: RecoveryUserUsecase,
    ) {}

    public static build(recoverUseruseacse: RecoveryUserUsecase) {
        return new RecoveryUserRoute(
            "/recovery-user/:id",
            HttpMethod.PUT,
            recoverUseruseacse,
        )
    }

    public getHandler(): (req: Request, res: Response) => Promise<void> {
        return async (req: Request, res: Response) => {
            const { id } = req.params
            const output = await this.recoverUseruseacse.execute({ id })

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
        return [AuthMiddleware(), GuardMiddleware(Role.ADMIN)]
    }
}
