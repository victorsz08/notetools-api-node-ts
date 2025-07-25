import { Request, Response, NextFunction } from "express"
import { HttpMethod, Route } from "../route.express"
import { DeleteUserUsecase } from "@/usecases/user/delete.usecase"
import { AuthMiddleware } from "@/middleware/auth.middleware"
import { GuardMiddleware } from "@/middleware/guard.middleware"
import { Role } from "@/domain/enum/role.enum"

export class DeleteUserRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly deleteUserUsecase: DeleteUserUsecase,
    ) {}

    public static build(deleteUserUsecase: DeleteUserUsecase) {
        return new DeleteUserRoute(
            "/users/:id",
            HttpMethod.DELETE,
            deleteUserUsecase,
        )
    }

    public getHandler(): (req: Request, res: Response) => Promise<void> {
        return async (req: Request, res: Response) => {
            const { id } = req.params
            await this.deleteUserUsecase.execute({ id })

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
        return [AuthMiddleware(), GuardMiddleware(Role.ADMIN)]
    }
}
