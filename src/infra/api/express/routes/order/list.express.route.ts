import { ListOrderUsecase } from "@/usecases/order/list.usecase"
import { HttpMethod, Route } from "../route.express"
import { listOrderDto } from "@/package/dtos/order.dto"
import { NextFunction, Request, Response } from "express"
import { verify } from "jsonwebtoken"
import { UserEntity } from "@/domain/entities/user.entity"
import { AuthMiddleware } from "@/middleware/auth.middleware"

export class ListOrderRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly listOrderUsecase: ListOrderUsecase,
    ) {}

    public static build(listOrderUsecase: ListOrderUsecase) {
        return new ListOrderRoute(
            "/list-orders",
            HttpMethod.GET,
            listOrderUsecase,
        )
    }

    public getHandler(): (req: Request, res: Response) => Promise<void> {
        return async (req: Request, res: Response) => {
            const input = listOrderDto.parse(req.query)
            const token = req.cookies["nt.authtoken"]
            const user = verify(
                token,
                String(process.env.JWT_SECRET),
            ) as UserEntity
            const output = await this.listOrderUsecase.execute({
                ...input,
                userId: user.id,
            })

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
