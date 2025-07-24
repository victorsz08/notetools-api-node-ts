import { Request, Response, NextFunction } from "express"
import { HttpMethod, Route } from "../route.express"
import { FindUserUsecase } from "@/usecases/user/find.usecase"
import { AuthMiddleware } from "@/middleware/auth.middleware"

export class FindUserRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly findUserUsecase: FindUserUsecase,
    ) {}

    public static build(findUserUsecase: FindUserUsecase) {
        return new FindUserRoute("/users/:id", HttpMethod.GET, findUserUsecase)
    }

    public getHandler(): (
        request: Request,
        response: Response,
    ) => Promise<void> {
        return async (request: Request, response: Response) => {
            const { id } = request.params
            const output = await this.findUserUsecase.execute({ id })

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
        return [AuthMiddleware()]
    }
}
