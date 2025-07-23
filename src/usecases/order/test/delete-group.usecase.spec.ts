import { OrderInterface } from "@/domain/interface/order.interface"
import {
    DeleteGroupOrderInput,
    DeleteGroupOrderUsecase,
} from "../delete-group.usecase"

describe("DeleteGroupOrderUsecase", () => {
    let mockRepository: jest.Mocked<OrderInterface>
    let usecase: DeleteGroupOrderUsecase

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

        usecase = DeleteGroupOrderUsecase.build(mockRepository)
    })

    test("deve deletar um grupo de pedidos com sucesso", async () => {
        const input = {} as DeleteGroupOrderInput

        await usecase.execute(input)
        expect(mockRepository.deleteGroup).toHaveBeenCalledWith(input.ids)
    })
})
