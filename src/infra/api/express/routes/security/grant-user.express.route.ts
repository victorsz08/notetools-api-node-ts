import { Request, Response, NextFunction } from "express"
import { HttpMethod, Route } from "../route.express"
import { GrantUserUsecase } from "@/usecases/security/grant-user.usecase"
import { AuthMiddleware } from "@/middleware/auth.middleware"
import { Validation } from "@/middleware/validate-schema"
import { grantUserDto } from "@/package/dtos/user.dto"
import { GuardMiddleware } from "@/middleware/guard.middleware"
import { Role } from "@/domain/enum/role.enum"

export class GrantUserRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly grantUserUsecase: GrantUserUsecase,
    ) {}

    public static build(grantUserUsecase: GrantUserUsecase) {
        return new GrantUserRoute(
            "/grant-user/:id",
            HttpMethod.PUT,
            grantUserUsecase,
        )
    }

    public getHandler(): (req: Request, res: Response) => Promise<void> {
        return async (req: Request, res: Response) => {
            const { id } = req.params
            await this.grantUserUsecase.execute({
                id,
                ...req.body,
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
        return [
            AuthMiddleware(),
            Validation(grantUserDto),
            GuardMiddleware(Role.ADMIN),
        ]
    }
}
