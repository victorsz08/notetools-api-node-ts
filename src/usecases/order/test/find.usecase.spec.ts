import { OrderInterface } from "@/domain/interface/order.interface"
import { FindOrderOutput, FindOrderUsecase } from "../find.usecase"
import { OrderEntity } from "@/domain/entities/order.entity"
import {
    HttpException,
    HttpStatusCode,
} from "@/package/exceptions/http-exceptions"

describe("FindOrderUsecase", () => {
    let mockRepository: jest.Mocked<OrderInterface>
    let usecase: FindOrderUsecase

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
        usecase = FindOrderUsecase.build(mockRepository)
    })

    test("deve retornar um pedido com sucesso", async () => {
        const order = {} as OrderEntity
        mockRepository.find.mockResolvedValue(order)
        const input = {
            id: "123",
        }

        const result = await usecase.execute(input)
        const output = {} as FindOrderOutput

        expect(result).toEqual(output)
        expect(mockRepository.find).toHaveBeenCalledWith(input.id)
    })

    test("deve lançar um erro de pedido não encontrado", async () => {
        const input = {
            id: "123",
        }

        mockRepository.find.mockResolvedValue(null)

        await expect(usecase.execute(input)).rejects.toThrow(
            new HttpException(
                HttpStatusCode.NOT_FOUND,
                "Pedido não localizado com esse id",
            ),
        )
        expect(mockRepository.find).toHaveBeenCalledWith(input.id)
    })
})
