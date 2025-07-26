import { Request, Response, NextFunction } from "express"
import { HttpMethod, Route } from "../route.express"
import { UpdateSchedulingOrderUsecase } from "@/usecases/order/update-scheduling.usecase"
import { AuthMiddleware } from "@/middleware/auth.middleware"
import { Validation } from "@/middleware/validate-schema"
import { updateSchedulingOrderDto } from "@/package/dtos/order.dto"

export class UpdateSchedulingOrderRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly updateSchedulingOrderUsecase: UpdateSchedulingOrderUsecase,
    ) {}

    public static build(
        updateSchedulingOrderUsecase: UpdateSchedulingOrderUsecase,
    ) {
        return new UpdateSchedulingOrderRoute(
            "/orders/update-scheduling/:id",
            HttpMethod.PUT,
            updateSchedulingOrderUsecase,
        )
    }

    public getHandler(): (req: Request, res: Response) => Promise<void> {
        return async (req: Request, res: Response) => {
            const { id } = req.params
            await this.updateSchedulingOrderUsecase.execute({ id, ...req.body })

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
        return [AuthMiddleware(), Validation(updateSchedulingOrderDto)]
    }
}
