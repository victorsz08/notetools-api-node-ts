import { Insight, InsightInterface } from "@/domain/interface/insight.interface"
import { GetInsightOutput, GetInsightUsecase } from "../insight.usecase"

describe("GetInsightUsecase", () => {
    let mockRepository: jest.Mocked<InsightInterface>
    let usecase: GetInsightUsecase

    beforeAll(() => {
        mockRepository = {
            getInsight: jest.fn(),
            getInsightDaily: jest.fn(),
            getInsightStatus: jest.fn(),
        }

        usecase = GetInsightUsecase.build(mockRepository)
    })

    test("deve retornar os insights com sucesso", async () => {
        const prevInsigth: Insight = {
            completionRate: 0.87,
            revenue: 3480.8,
            sales: 50,
        }
        const currInsight: Insight = {
            revenue: 4180.9,
            completionRate: 0.97,
            sales: 57,
        }

        mockRepository.getInsight.mockResolvedValueOnce(prevInsigth)
        mockRepository.getInsight.mockResolvedValueOnce(currInsight)

        const input = {
            userId: "test_id",
            startDate: expect.any(Date),
            endDate: expect.any(Date),
        }

        const output: GetInsightOutput = {
            revenue: currInsight.revenue,
            trendRevenue:
                currInsight.revenue === 0
                    ? 0
                    : prevInsigth.revenue / currInsight.revenue,
            completionRate: currInsight.completionRate,
            trendCompletionRate:
                currInsight.completionRate === 0
                    ? 0
                    : prevInsigth.completionRate / currInsight.completionRate,
            sales: currInsight.sales,
            trendSales:
                currInsight.sales === 0
                    ? 0
                    : prevInsigth.sales / currInsight.sales,
        }

        const result = await usecase.execute(input)

        expect(result).toEqual(output)
        expect(mockRepository.getInsight).toHaveBeenCalledWith(
            input.userId,
            input.startDate,
            input.endDate,
        )
    })
})
