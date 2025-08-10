import { InsightInterface } from "../../domain/interface/insight.interface"
import { Usecase } from "../usecase.core"
import { DatePattern } from "../../patterns/date"

export type GetInsightInput = {
    userId: string
    startDate: Date
    endDate: Date
}

export type GetInsightOutput = {
    trendSales: number
    sales: number
    trendRevenue: number
    revenue: number
    trendCompletionRate: number
    completionRate: number
}

export class GetInsightUsecase
    implements Usecase<GetInsightInput, GetInsightOutput>
{
    private constructor(private readonly insightInterface: InsightInterface) {}

    public static build(insightInterface: InsightInterface) {
        return new GetInsightUsecase(insightInterface)
    }
    public async execute(input: GetInsightInput): Promise<GetInsightOutput> {
        const { userId, startDate, endDate } = input
        const prevStartDate = DatePattern.subMonth(startDate, 1)
        const prevEndDate = DatePattern.subMonth(endDate, 1)

        const prevInsight = await this.insightInterface.getInsight(
            userId,
            prevStartDate,
            prevEndDate,
        )
        const insight = await this.insightInterface.getInsight(
            userId,
            startDate,
            endDate,
        )

        const trendSales =
            insight.sales === 0 ? 0 : prevInsight.sales / insight.sales
        const trendCompletionRate =
            insight.completionRate === 0
                ? 0
                : prevInsight.completionRate / insight.completionRate
        const trendRevenue =
            insight.revenue === 0 ? 0 : prevInsight.revenue / insight.revenue

        return {
            revenue: insight.revenue,
            trendRevenue,
            sales: insight.sales,
            trendSales,
            completionRate: insight.completionRate,
            trendCompletionRate,
        }
    }
}
