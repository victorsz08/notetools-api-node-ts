import { InsightInterface } from "../../domain/interface/insight.interface"
import { Usecase } from "../usecase.core"

export type GetInsightStatusInput = {
    userId: string
    startDate: Date
    endDate: Date
}

export type GetInsightStatusOutput = {
    pending: number
    connected: number
    canceled: number
}

export class GetInsightStatusUsecase
    implements Usecase<GetInsightStatusInput, GetInsightStatusOutput>
{
    private constructor(private readonly insightInterface: InsightInterface) {}

    public static build(insightInterface: InsightInterface) {
        return new GetInsightStatusUsecase(insightInterface)
    }
    public async execute(
        input: GetInsightStatusInput,
    ): Promise<GetInsightStatusOutput> {
        const { userId, startDate, endDate } = input
        const insightStatus = await this.insightInterface.getInsightStatus(
            userId,
            startDate,
            endDate,
        )

        return insightStatus
    }
}
