import { OrderInterface } from "@/domain/interface/order.interface"
import { UpdateOrderInput, UpdateOrderUsecase } from "../update.usecase"
import { OrderEntity } from "@/domain/entities/order.entity"
import {
    HttpException,
    HttpStatusCode,
} from "@/package/exceptions/http-exceptions"

describe("UpdateOrderUsecase", () => {
    let mockRepository: jest.Mocked<OrderInterface>
    let usecase: UpdateOrderUsecase

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

        usecase = UpdateOrderUsecase.build(mockRepository)
    })

    test("deve atualizar um pedido com sucesso", async () => {
        const data = {} as OrderEntity
        mockRepository.find.mockResolvedValue(data)
        const input = {} as UpdateOrderInput

        await usecase.execute(input)

        expect(mockRepository.update).toHaveBeenCalledWith(input)
        expect(mockRepository.find).toHaveBeenCalledWith(input.id)
    })

    test("deve lançar um erro se o pedido não for encontrado", async () => {
        mockRepository.find.mockResolvedValue(null)
        const input = {} as UpdateOrderInput

        await expect(usecase.execute(input)).rejects.toThrow(
            new HttpException(
                HttpStatusCode.NOT_FOUND,
                "Pedido não encontrado com esse id",
            ),
        )
        expect(mockRepository.find).toHaveBeenCalledWith(input.id)
    })
})
