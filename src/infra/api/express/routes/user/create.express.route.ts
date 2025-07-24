import { NextFunction, Request, Response } from "express"
import { HttpMethod, Route } from "../route.express"
import { CreateUserUsecase } from "@/usecases/user/create.usecase"
import { Validation } from "@/middleware/validate-schema"
import { createUserDto } from "@/package/dtos/user.dto"
import { AuthMiddleware } from "@/middleware/auth.middleware"
import { GuardMiddleware } from "@/middleware/guard.middleware"
import { Role } from "@/domain/enum/role.enum"

export class CreateUserRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly createUserUsecase: CreateUserUsecase,
    ) {}

    public static build(createUserUsecase: CreateUserUsecase) {
        return new CreateUserRoute("/users", HttpMethod.POST, createUserUsecase)
    }

    public getHandler(): (
        request: Request,
        response: Response,
    ) => Promise<void> {
        return async (request: Request, response: Response) => {
            await this.createUserUsecase.execute(request.body)
            response.status(201).send()
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
            Validation(createUserDto),
            AuthMiddleware(),
            GuardMiddleware(Role.ADMIN),
        ]
    }
}
