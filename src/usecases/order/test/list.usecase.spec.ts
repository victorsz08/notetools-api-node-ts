import { OrderInterface, OrderList } from "@/domain/interface/order.interface"
import {
    ListOrderInput,
    ListOrderOutput,
    ListOrderUsecase,
} from "../list.usecase"

describe("ListOrderUsecase", () => {
    let mockRepository: jest.Mocked<OrderInterface>
    let usecase: ListOrderUsecase

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

        usecase = ListOrderUsecase.build(mockRepository)
    })

    test("deve retornar uma lista de pedidos com sucesso", async () => {
        const data = {
            orders: [],
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 1,
        } as OrderList

        mockRepository.list.mockResolvedValue(data)
        const input: ListOrderInput = {
            page: 1,
            limit: 10,
            userId: "123",
        }

        const result = await usecase.execute(input)
        const output: ListOrderOutput = {
            orders: data.orders.map((order) => ({
                id: order.id,
                number: order.number,
                local: order.local,
                observation: order.observation,
                schedulingDate: order.schedulingDate,
                schedulingTime: order.schedulingTime,
                price: order.price,
                contact: order.contact,
                status: order.status,
                type: order.type,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
            })),
            total: data.total,
            page: data.page,
            limit: data.limit,
            totalPages: data.totalPages,
        }

        expect(result).toEqual(output)
        expect(output.page).toBeGreaterThanOrEqual(1)
        expect(output.limit).toEqual(input.limit)
        expect(output.total).toBeGreaterThanOrEqual(0)
        expect(mockRepository.list).toHaveBeenCalledWith(input)
    })
})
