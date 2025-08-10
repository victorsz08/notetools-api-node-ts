import { ChangePasswordUsecase } from "../../../../../usecases/user/change-password.usecase"
import { HttpMethod, Route } from "../route.express"
import { NextFunction, Request, Response } from "express"
import { AuthMiddleware } from "../../../../../middleware/auth.middleware"
import { Validation } from "../../../../../middleware/validate-schema"
import { changePasswordDto } from "../../../../../package/dtos/user.dto"

export class ChangePasswordRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly changePasswordUsecase: ChangePasswordUsecase,
    ) {}

    public static build(changePasswordUsecase: ChangePasswordUsecase) {
        return new ChangePasswordRoute(
            "/users/update-password/:id",
            HttpMethod.PUT,
            changePasswordUsecase,
        )
    }

    public getHandler(): (
        request: Request,
        response: Response,
    ) => Promise<void> {
        return async (request: Request, response: Response) => {
            const { id } = request.params
            await this.changePasswordUsecase.execute({
                id,
                ...request.body,
            })

            response.status(200).send()
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
        return [AuthMiddleware(), Validation(changePasswordDto)]
    }
}
