import { Request, Response, NextFunction } from "express"
import { HttpMethod, Route } from "../route.express"
import { CreateOrderUsecase } from "../../../../../usecases/order/create.usecase"
import { AuthMiddleware } from "../../../../../middleware/auth.middleware"
import { Validation } from "../../../../../middleware/validate-schema"
import { createOrderDto } from "../../../../../package/dtos/order.dto"

export class CreateOrderRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly createOrderUsecase: CreateOrderUsecase,
    ) {}

    public static build(createOrderUsecase: CreateOrderUsecase) {
        return new CreateOrderRoute(
            "/orders/:userId",
            HttpMethod.POST,
            createOrderUsecase,
        )
    }

    public getHandler(): (req: Request, res: Response) => Promise<void> {
        return async (req: Request, res: Response) => {
            const { userId } = req.params
            await this.createOrderUsecase.execute({
                userId,
                ...req.body,
            })

            res.status(201).send()
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
        return [AuthMiddleware(), Validation(createOrderDto)]
    }
}
