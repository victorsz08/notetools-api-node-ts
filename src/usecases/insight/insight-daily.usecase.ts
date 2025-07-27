import {
    InsightDaily,
    InsightInterface,
} from "@/domain/interface/insight.interface"
import { Usecase } from "../usecase.core"

export type GetInsightDailyInput = {
    userId: string
    startDate: Date
    endDate: Date
}

export type GetInsightDailyOutput = {
    days: {
        quantity: number
        date: Date
    }[]
}

export class GetInsightDailyUsecase
    implements Usecase<GetInsightDailyInput, GetInsightDailyOutput>
{
    private constructor(private readonly insightInterface: InsightInterface) {}

    public static build(insightInterface: InsightInterface) {
        return new GetInsightDailyUsecase(insightInterface)
    }

    public async execute(
        input: GetInsightDailyInput,
    ): Promise<GetInsightDailyOutput> {
        const { userId, startDate, endDate } = input
        const insightDaily = await this.insightInterface.getInsightDaily(
            userId,
            startDate,
            endDate,
        )

        const output = this.present(insightDaily)
        return output
    }

    private present(data: InsightDaily[]): GetInsightDailyOutput {
        return {
            days: data.map((sale) => {
                return {
                    quantity: sale.quantity,
                    date: sale.date,
                }
            }),
        }
    }
}
