import {
    InsightInterface,
    InsightStatus,
} from "@/domain/interface/insight.interface"
import { GetInsightStatusUsecase } from "../insight-status.usecase"

describe("GetInsightStatusUsecase", () => {
    let mockRepository: jest.Mocked<InsightInterface>
    let usecase: GetInsightStatusUsecase

    beforeAll(() => {
        mockRepository = {
            getInsight: jest.fn(),
            getInsightDaily: jest.fn(),
            getInsightStatus: jest.fn(),
        }

        usecase = GetInsightStatusUsecase.build(mockRepository)
    })

    test("deve retornar o insight de status com sucesso", async () => {
        const input = {
            userId: "test_id",
            startDate: expect.any(Date),
            endDate: expect.any(Date),
        }

        const insightStatus: InsightStatus = {
            connected: 10,
            canceled: 10,
            pending: 10,
        }
        mockRepository.getInsightStatus.mockResolvedValue(insightStatus)

        const result = await usecase.execute(input)
        expect(result).toEqual(insightStatus)
        expect(mockRepository.getInsightStatus).toHaveBeenCalledWith(
            input.userId,
            input.startDate,
            input.endDate,
        )
    })
})
