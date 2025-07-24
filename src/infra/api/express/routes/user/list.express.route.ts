import { Request, Response, NextFunction } from "express"
import { HttpMethod, Route } from "../route.express"
import { ListUserUsecase } from "@/usecases/user/list.usecase"
import { listUserDto } from "@/package/dtos/user.dto"
import { AuthMiddleware } from "@/middleware/auth.middleware"
import { GuardMiddleware } from "@/middleware/guard.middleware"
import { Role } from "@/domain/enum/role.enum"

export class ListUserRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly listUserUsecase: ListUserUsecase,
    ) {}

    public static build(listUserUsecase: ListUserUsecase) {
        return new ListUserRoute("/list-users", HttpMethod.GET, listUserUsecase)
    }

    public getHandler(): (
        request: Request,
        response: Response,
    ) => Promise<void> {
        return async (request: Request, response: Response) => {
            const input = listUserDto.parse(request.query)
            const output = await this.listUserUsecase.execute(input)

            response.status(200).send(output)
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
