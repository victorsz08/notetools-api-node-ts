import { DeleteOrderUsecase } from "./../../../../../usecases/order/delete.usecase"
import { Request, Response, NextFunction } from "express"
import { HttpMethod, Route } from "../route.express"
import { AuthMiddleware } from "../../../../../middleware/auth.middleware"

export class DeleteOrderRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly deleteOrderUsecase: DeleteOrderUsecase,
    ) {}

    public static build(deleteOrderUsecase: DeleteOrderUsecase) {
        return new DeleteOrderRoute(
            "/orders/:id",
            HttpMethod.DELETE,
            deleteOrderUsecase,
        )
    }

    public getHandler(): (req: Request, res: Response) => Promise<void> {
        return async (req: Request, res: Response) => {
            const { id } = req.params
            await this.deleteOrderUsecase.execute({ id })

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
        return [AuthMiddleware()]
    }
}
