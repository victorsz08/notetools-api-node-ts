import { Request, Response, NextFunction } from "express"
import { HttpMethod, Route } from "../route.express"
import { GetInsightDailyUsecase } from "../../../../../usecases/insight/insight-daily.usecase"
import { verify } from "jsonwebtoken"
import { UserEntity } from "../../../../../domain/entities/user.entity"
import { getInsightDto } from "../../../../../package/dtos/insight.dto"
import { AuthMiddleware } from "../../../../../middleware/auth.middleware"

export class GetInsightDailyRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly getInsightDailyUsecase: GetInsightDailyUsecase,
    ) {}

    public static build(getInsightDailyUsecase: GetInsightDailyUsecase) {
        return new GetInsightDailyRoute(
            "/insight-daily",
            HttpMethod.GET,
            getInsightDailyUsecase,
        )
    }

    public getHandler(): (req: Request, res: Response) => Promise<void> {
        return async (req: Request, res: Response) => {
            const token = req.cookies["nt.authtoken"]
            const user = verify(
                token,
                String(process.env.JWT_SECRET),
            ) as UserEntity
            const userId = user.id
            const query = getInsightDto.parse(req.query)

            const output = await this.getInsightDailyUsecase.execute({
                userId,
                ...query,
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
