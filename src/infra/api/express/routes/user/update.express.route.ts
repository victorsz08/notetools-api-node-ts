import { Request, Response, NextFunction } from "express"
import { HttpMethod, Route } from "../route.express"
import { UpdateUserUsecase } from "../../../../../usecases/user/update.usecase"
import { AuthMiddleware } from "../../../../../middleware/auth.middleware"
import { Validation } from "../../../../../middleware/validate-schema"
import { updateUserDto } from "../../../../../package/dtos/user.dto"

export class UpdateUserRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly updateUserUsecase: UpdateUserUsecase,
    ) {}

    public static build(updateUserUsecase: UpdateUserUsecase) {
        return new UpdateUserRoute(
            "/users/:id",
            HttpMethod.PUT,
            updateUserUsecase,
        )
    }

    public getHandler(): (
        request: Request,
        response: Response,
    ) => Promise<void> {
        return async (request: Request, response: Response) => {
            const { id } = request.params
            await this.updateUserUsecase.execute({
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
        return [AuthMiddleware(), Validation(updateUserDto)]
    }
}
