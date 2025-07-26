import { Request, Response, NextFunction } from "express"
import { HttpMethod, Route } from "../route.express"
import { UpdateStatusOrderUsecase } from "@/usecases/order/update-status.usecase"
import { AuthMiddleware } from "@/middleware/auth.middleware"
import { Validation } from "@/middleware/validate-schema"
import { updateStatusOrderDto } from "@/package/dtos/order.dto"

export class UpdateStatusOrderRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly updateStatusOrderUsecase: UpdateStatusOrderUsecase,
    ) {}

    public static build(updateStatusOrderUsecase: UpdateStatusOrderUsecase) {
        return new UpdateStatusOrderRoute(
            "/orders/update-status/:id",
            HttpMethod.PUT,
            updateStatusOrderUsecase,
        )
    }

    public getHandler(): (req: Request, res: Response) => Promise<void> {
        return async (req: Request, res: Response) => {
            const { id } = req.params
            await this.updateStatusOrderUsecase.execute({ id, ...req.body })

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
        return [AuthMiddleware(), Validation(updateStatusOrderDto)]
    }
}
