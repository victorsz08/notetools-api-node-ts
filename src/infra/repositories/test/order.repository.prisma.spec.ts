import { OrderRepositoryPrisma } from "../order.repository.prisma"
import { OrderEntity } from "@/domain/entities/order.entity"
import { Status } from "@/domain/enum/status.enum"
import { TimeSlot } from "@/domain/enum/time-slot.enum"
import { TypeOrder } from "@/domain/enum/type-order.enum"

const mockPrisma = {
    contract: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    /* eslint-disable @typescript-eslint/no-explicit-any */
} as any

describe("OrderRepositoryPrisma", () => {
    let repository: OrderRepositoryPrisma

    beforeAll(() => {
        repository = OrderRepositoryPrisma.build(mockPrisma)
    })

    test("deve criar um pedido com sucesso", async () => {
        const input = OrderEntity.with({
            id: "1",
            number: 100,
            local: "Local A",
            observation: "Obs",
            schedulingDate: new Date(),
            schedulingTime: TimeSlot.MORNING,
            price: 10,
            contact: "Contato",
            status: Status.PENDING,
            type: TypeOrder.BASE,
            userId: "user1",
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        await repository.create(input)
        expect(mockPrisma.contract.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                id: input.id,
                number: input.number,
                local: input.local,
                observation: input.observation,
                schedulingDate: input.schedulingDate,
                schedulingTime: input.schedulingTime,
                price: input.price,
                type: input.type,
                status: input.status,
                contact: input.contact,
                user: { connect: { id: input.userId } },
                products: [],
                createdAt: input.createdAt,
                updatedAt: input.updatedAt,
            }),
        })
    })

    test("deve retornar um pedido com sucesso", async () => {
        const prismaOrder = {
            id: "2",
            number: 101,
            local: "Local B",
            observation: "Obs2",
            schedulingDate: new Date(),
            schedulingTime: TimeSlot.EVENING,
            price: 20,
            contact: "Contato2",
            status: Status.CONNECTED,
            type: TypeOrder.PROSPECT,
            userId: "user2",
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        mockPrisma.contract.findUnique.mockResolvedValue(prismaOrder)
        const result = await repository.find(prismaOrder.id)
        expect(mockPrisma.contract.findUnique).toHaveBeenCalledWith({
            where: { id: prismaOrder.id },
        })
        expect(result).toEqual(
            OrderEntity.with({
                ...prismaOrder,
                observation: prismaOrder.observation ?? "",
            }),
        )
    })

    test("deve retornar null se pedido não encontrado", async () => {
        mockPrisma.contract.findUnique.mockResolvedValue(null)
        const result = await repository.find("id-inexistente")
        expect(result).toBeNull()
    })

    test("deve listar pedidos com sucesso", async () => {
        const page = 1
        const limit = 2
        const userId = "user3"
        const orders = [
            {
                id: "3",
                number: 102,
                local: "Local C",
                observation: "Obs3",
                schedulingDate: new Date(),
                schedulingTime: TimeSlot.FULL_DAY,
                price: 30,
                contact: "Contato3",
                status: Status.PENDING,
                type: TypeOrder.BASE,
                userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]
        mockPrisma.contract.findMany.mockResolvedValue(orders)
        mockPrisma.contract.count.mockResolvedValue(orders.length)
        const query = { page, limit, userId }
        const result = await repository.list(query)
        expect(mockPrisma.contract.count).toHaveBeenCalled()
        expect(mockPrisma.contract.findMany).toHaveBeenCalled()
        expect(result.orders).toHaveLength(1)
        expect(result.total).toBe(1)
        expect(result.page).toBe(page)
        expect(result.limit).toBe(limit)
        expect(result.totalPages).toBe(1)
        expect(result.orders[0]).toBeInstanceOf(OrderEntity)
    })

    test("deve atualizar um pedido com sucesso", async () => {
        const order = {
            id: "4",
            number: 200,
            local: "Local D",
            updatedAt: new Date(),
        }
        mockPrisma.contract.update.mockResolvedValue(undefined)
        await repository.update(order)
        expect(mockPrisma.contract.update).toHaveBeenCalledWith({
            where: { id: order.id },
            data: expect.objectContaining({
                number: order.number,
                local: order.local,
                updatedAt: order.updatedAt,
            }),
        })
    })

    test("deve atualizar status do pedido com sucesso", async () => {
        const id = "5"
        const status = Status.CONNECTED
        const updatedAt = new Date()
        mockPrisma.contract.update.mockResolvedValue(undefined)
        await repository.updateStatus(id, status, updatedAt)
        expect(mockPrisma.contract.update).toHaveBeenCalledWith({
            where: { id },
            data: { status, updatedAt },
        })
    })

    test("deve deletar um grupo de pedidos com sucesso", async () => {
        const ids = ["6", "7"]
        mockPrisma.contract.delete.mockResolvedValue(undefined)
        await repository.deleteGroup(ids)
        expect(mockPrisma.contract.delete).toHaveBeenCalledWith({
            where: { id: ids[0] },
        })
    })

    test("deve atualizar agendamento do pedido com sucesso", async () => {
        const id = "8"
        const schedulingDate = new Date()
        const schedulingTime = TimeSlot.MORNING
        const updatedAt = new Date()
        mockPrisma.contract.update.mockResolvedValue(undefined)
        await repository.updateScheduling(
            id,
            schedulingDate,
            schedulingTime,
            updatedAt,
        )
        expect(mockPrisma.contract.update).toHaveBeenCalledWith({
            where: { id },
            data: { schedulingDate, schedulingTime, updatedAt },
        })
    })

    test("deve deletar um pedido com sucesso", async () => {
        const id = "9"
        mockPrisma.contract.delete.mockResolvedValue(undefined)
        await repository.delete(id)
        expect(mockPrisma.contract.delete).toHaveBeenCalledWith({
            where: { id },
        })
    })
})
