import { prismaClient } from "@/package/prisma-client/prisma"
import { InsightRepositoryPrisma } from "../repositories/insight.repository.prisma"
import { GetInsightUsecase } from "@/usecases/insight/insight.usecase"
import { GetInsightStatusUsecase } from "@/usecases/insight/insight-status.usecase"
import { GetInsightDailyUsecase } from "@/usecases/insight/insight-daily.usecase"
import { GetInsightRoute } from "../api/express/routes/insight/insight.express.route"
import { GetInsightStatusRoute } from "../api/express/routes/insight/insight-status.express.route"
import { GetInsightDailyRoute } from "../api/express/routes/insight/insight-daily.express.route"

export const InsightFactory = () => {
    const insightRepository = InsightRepositoryPrisma.build(prismaClient)

    const getInsightUsecase = GetInsightUsecase.build(insightRepository)
    const getInsightStatusUsecase =
        GetInsightStatusUsecase.build(insightRepository)
    const getInsightDailyUsecase =
        GetInsightDailyUsecase.build(insightRepository)

    const getInsightRoute = GetInsightRoute.build(getInsightUsecase)
    const getInsightStatusRoute = GetInsightStatusRoute.build(
        getInsightStatusUsecase,
    )
    const getInsightDailyRoute = GetInsightDailyRoute.build(
        getInsightDailyUsecase,
    )

    return [getInsightRoute, getInsightStatusRoute, getInsightDailyRoute]
}
