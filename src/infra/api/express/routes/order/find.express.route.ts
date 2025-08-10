import { Request, Response, NextFunction } from "express"
import { HttpMethod, Route } from "../route.express"
import { FindOrderUsecase } from "../../../../../usecases/order/find.usecase"
import { AuthMiddleware } from "../../../../../middleware/auth.middleware"

export class FindOrderRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly findOrderUsecase: FindOrderUsecase,
    ) {}

    public static build(findOrderUsecase: FindOrderUsecase) {
        return new FindOrderRoute(
            "/orders/:id",
            HttpMethod.GET,
            findOrderUsecase,
        )
    }

    public getHandler(): (req: Request, res: Response) => Promise<void> {
        return async (req: Request, res: Response) => {
            const { id } = req.params
            const output = await this.findOrderUsecase.execute({ id })

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
