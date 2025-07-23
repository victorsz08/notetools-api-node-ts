import { OrderInterface } from "@/domain/interface/order.interface"
import { OrderEntity } from "@/domain/entities/order.entity"
import {
    HttpException,
    HttpStatusCode,
} from "@/package/exceptions/http-exceptions"
import {
    UpdateStatusOrderInput,
    UpdateStatusOrderUsecase,
} from "../update-status.usecase"

describe("UpdateStatusOrderUsecase", () => {
    let mockRepository: jest.Mocked<OrderInterface>
    let usecase: UpdateStatusOrderUsecase

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

        usecase = UpdateStatusOrderUsecase.build(mockRepository)
    })

    test("deve atualizar o status de um pedido com sucesso", async () => {
        const data = {} as OrderEntity
        mockRepository.find.mockResolvedValue(data)
        const input = {} as UpdateStatusOrderInput

        await usecase.execute(input)

        expect(mockRepository.updateStatus).toHaveBeenCalledWith(
            input.id,
            input.status,
        )
        expect(mockRepository.find).toHaveBeenCalledWith(input.id)
    })

    test("deve lançar um erro se o pedido não for encontrado", async () => {
        mockRepository.find.mockResolvedValue(null)
        const input = {} as UpdateStatusOrderInput

        await expect(usecase.execute(input)).rejects.toThrow(
            new HttpException(
                HttpStatusCode.NOT_FOUND,
                "Pedido não encontrado com esse id",
            ),
        )
        expect(mockRepository.find).toHaveBeenCalledWith(input.id)
    })
})
