import { OrderInterface } from "@/domain/interface/order.interface"
import { DeleteOrderUsecase } from "../delete.usecase"
import { OrderEntity } from "@/domain/entities/order.entity"
import {
    HttpException,
    HttpStatusCode,
} from "@/package/exceptions/http-exceptions"

describe("DeleteOrderUsecase", () => {
    let mockRepository: jest.Mocked<OrderInterface>
    let usecase: DeleteOrderUsecase

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

        usecase = DeleteOrderUsecase.build(mockRepository)
    })

    test("deve deletar um pedido com sucesso", async () => {
        const data = {} as OrderEntity
        mockRepository.find.mockResolvedValue(data)

        const input = {
            id: "1234",
        }

        await usecase.execute(input)

        expect(mockRepository.delete).toHaveBeenCalledWith(input.id)
    })

    test("deve lançar uma exceção de pedido não localizado", async () => {
        const input = {
            id: "134",
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
