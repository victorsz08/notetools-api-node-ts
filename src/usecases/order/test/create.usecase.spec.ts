import { OrderInterface } from "@/domain/interface/order.interface"
import { CreateOrderUsecase } from "../create.usecase"
import { OrderEntity } from "@/domain/entities/order.entity"
import { TypeOrder } from "@/domain/enum/type-order.enum"
import { TimeSlot } from "@/domain/enum/time-slot.enum"
import { Status } from "@/domain/enum/status.enum"

describe("CreateOrderUsecase", () => {
    let mockOrderRepository: OrderInterface
    let usecase: CreateOrderUsecase

    beforeEach(() => {
        mockOrderRepository = {
            create: jest.fn(),
        } as unknown as OrderInterface

        usecase = CreateOrderUsecase.build(mockOrderRepository)
    })

    test("deve criar um pedido com sucesso", async () => {
        const order = OrderEntity.build(
            1,
            "local",
            "observation",
            new Date(),
            TimeSlot.EVENING,
            "contact",
            TypeOrder.PROSPECT,
            100,
            "userId",
        )

        await usecase.execute(order)

        expect(mockOrderRepository.create).toHaveBeenCalled()
        expect(order.id).toBeDefined()
        expect(order.createdAt).toBeDefined()
        expect(order.updatedAt).toBeDefined()
        expect(order.status).toBe(Status.PENDING)
    })
})
