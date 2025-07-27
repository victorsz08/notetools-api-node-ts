import {
    InsightDaily,
    InsightInterface,
} from "@/domain/interface/insight.interface"
import {
    GetInsightDailyOutput,
    GetInsightDailyUsecase,
} from "../insight-daily.usecase"

describe("GetInsightDailyUsecase", () => {
    let mockRepository: jest.Mocked<InsightInterface>
    let usecase: GetInsightDailyUsecase

    beforeAll(() => {
        mockRepository = {
            getInsight: jest.fn(),
            getInsightDaily: jest.fn(),
            getInsightStatus: jest.fn(),
        }

        usecase = GetInsightDailyUsecase.build(mockRepository)
    })

    test("deve retornar um array de insights por dia com sucesso", async () => {
        const insightDaily: InsightDaily[] = [
            {
                quantity: 2,
                date: expect.any(Date),
            },
            {
                quantity: 2,
                date: expect.any(Date),
            },
        ]

        mockRepository.getInsightDaily.mockResolvedValue(insightDaily)
        const input = {
            userId: "test_id",
            startDate: expect.any(Date),
            endDate: expect.any(Date),
        }

        const output: GetInsightDailyOutput = {
            days: insightDaily.map((insight) => {
                return {
                    quantity: insight.quantity,
                    date: insight.date,
                }
            }),
        }

        const result = await usecase.execute(input)

        expect(result).toEqual(output)
        expect(mockRepository.getInsightDaily).toHaveBeenCalledWith(
            input.userId,
            input.startDate,
            input.endDate,
        )
    })
})
