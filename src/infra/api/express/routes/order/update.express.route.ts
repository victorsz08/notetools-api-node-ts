import { UpdateOrderUsecase } from "@/usecases/order/update.usecase"
import { HttpMethod, Route } from "../route.express"
import { Request, Response, NextFunction } from "express"
import { AuthMiddleware } from "@/middleware/auth.middleware"
import { Validation } from "@/middleware/validate-schema"
import { updateOrderDto } from "@/package/dtos/order.dto"

export class UpdateOrderRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly updateOrderUsecase: UpdateOrderUsecase,
    ) {}

    public static build(updateOrderUsecase: UpdateOrderUsecase) {
        return new UpdateOrderRoute(
            "/orders/:id",
            HttpMethod.PUT,
            updateOrderUsecase,
        )
    }

    public getHandler(): (req: Request, res: Response) => Promise<void> {
        return async (req: Request, res: Response) => {
            const { id } = req.params
            await this.updateOrderUsecase.execute({
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
        return [AuthMiddleware(), Validation(updateOrderDto)]
    }
}
