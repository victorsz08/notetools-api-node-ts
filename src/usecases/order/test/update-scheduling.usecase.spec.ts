import { OrderInterface } from "@/domain/interface/order.interface"
import {
    UpdateSchedulingOrderInput,
    UpdateSchedulingOrderUsecase,
} from "../update-scheduling.usecase"
import { OrderEntity } from "@/domain/entities/order.entity"
import {
    HttpException,
    HttpStatusCode,
} from "@/package/exceptions/http-exceptions"

describe("UpdateSchedulingOrderUsecase", () => {
    let mockRepository: jest.Mocked<OrderInterface>
    let usecase: UpdateSchedulingOrderUsecase

    beforeAll(() => {
        mockRepository = {
            find: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            list: jest.fn(),
            deleteGroup: jest.fn(),
            updateScheduling: jest.fn(),
            updateStatus: jest.fn(),
        }

        usecase = UpdateSchedulingOrderUsecase.build(mockRepository)
    })

    test("deve atualizar a data e hora de um pedido com sucesso", async () => {
        const data = {} as OrderEntity
        mockRepository.find.mockResolvedValue(data)
        const input = {} as UpdateSchedulingOrderInput
        const updatedAt = expect.any(Date)

        await usecase.execute(input)

        expect(mockRepository.updateScheduling).toHaveBeenCalledWith(
            input.id,
            input.schedulingDate,
            input.schedulingTime,
            updatedAt,
        )
        expect(mockRepository.find).toHaveBeenCalledWith(input.id)
    })

    test("deve lançar um erro se o pedido não for encontrado", async () => {
        mockRepository.find.mockResolvedValue(null)
        const input = {} as UpdateSchedulingOrderInput

        await expect(usecase.execute(input)).rejects.toThrow(
            new HttpException(
                HttpStatusCode.NOT_FOUND,
                "Pedido não encontrado com esse id",
            ),
        )
        expect(mockRepository.find).toHaveBeenCalledWith(input.id)
    })
})
