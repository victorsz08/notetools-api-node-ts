import { OrderEntity } from "@/domain/entities/order.entity"
import { Status } from "@/domain/enum/status.enum"
import { TimeSlot } from "@/domain/enum/time-slot.enum"
import { TypeOrder } from "@/domain/enum/type-order.enum"
import {
    OrderInterface,
    OrderList,
    OrderListQuery,
} from "@/domain/interface/order.interface"
import { Prisma, PrismaClient } from "@prisma/client"

export class OrderRepositoryPrisma implements OrderInterface {
    private constructor(private readonly repository: PrismaClient) {}

    public static build(repository: PrismaClient) {
        return new OrderRepositoryPrisma(repository)
    }

    public async create(order: OrderEntity): Promise<void> {
        await this.repository.contract.create({
            data: {
                id: order.id,
                number: order.number,
                local: order.local,
                observation: order.observation,
                schedulingDate: order.schedulingDate,
                schedulingTime: order.schedulingTime,
                price: order.price,
                type: order.type,
                status: order.status,
                contact: order.contact,
                user: {
                    connect: { id: order.userId },
                },
                products: [],
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
            },
        })

        return
    }

    public async find(id: string): Promise<OrderEntity | null> {
        const order = await this.repository.contract.findUnique({
            where: { id },
        })

        if (!order) return null

        return OrderEntity.with({
            id: order.id,
            number: order.number,
            local: order.local,
            observation: order.observation ?? "",
            contact: order.contact,
            schedulingDate: order.schedulingDate,
            schedulingTime: order.schedulingTime as TimeSlot,
            status: order.status,
            price: order.price,
            type: order.type as TypeOrder,
            userId: order.userId,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        })
    }

    public async list(query: OrderListQuery): Promise<OrderList> {
        const {
            page,
            limit,
            userId,
            createdDateIn,
            createdDateOut,
            schedulingDateIn,
            schedulingDateOut,
            status,
            type,
        } = query

        const queryArgs: Prisma.ContractFindManyArgs = {
            where: {
                user: {
                    id: userId,
                },
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                schedulingDate: "desc",
            },
        }

        const countArgs: Prisma.ContractCountArgs = {
            where: {
                user: {
                    id: userId,
                },
            },
        }

        if (status) {
            queryArgs.where = {
                ...queryArgs.where,
                status: {
                    equals: status,
                },
            }

            countArgs.where = {
                ...countArgs.where,
                status: {
                    equals: status,
                },
            }
        }

        if (createdDateIn && createdDateOut) {
            queryArgs.where = {
                ...queryArgs.where,
                createdAt: {
                    lte: createdDateIn.toLocaleDateString(),
                    gte: createdDateOut.toLocaleDateString(),
                },
            }

            countArgs.where = {
                ...countArgs.where,
                createdAt: {
                    lte: createdDateIn.toLocaleDateString(),
                    gte: createdDateOut.toLocaleDateString(),
                },
            }
        }

        if (schedulingDateIn && schedulingDateOut) {
            queryArgs.where = {
                ...queryArgs.where,
                schedulingDate: {
                    lte: schedulingDateIn.toLocaleDateString(),
                    gte: schedulingDateOut.toLocaleDateString(),
                },
            }

            countArgs.where = {
                ...countArgs.where,
                schedulingDate: {
                    lte: schedulingDateIn.toLocaleDateString(),
                    gte: schedulingDateOut.toLocaleDateString(),
                },
            }
        }

        if (type) {
            queryArgs.where = {
                ...queryArgs.where,
                type: {
                    equals: type,
                },
            }

            countArgs.where = {
                ...countArgs.where,
                type: {
                    equals: type,
                },
            }
        }

        const [total, orders] = await Promise.all([
            this.repository.contract.count(countArgs),
            this.repository.contract.findMany(queryArgs),
        ])

        const totalPages = Math.ceil(total / limit)
        const orderList = orders.map((order) =>
            OrderEntity.with({
                id: order.id,
                number: order.number,
                local: order.local,
                observation: order.observation ?? "",
                contact: order.contact,
                schedulingDate: order.schedulingDate,
                schedulingTime: order.schedulingTime as TimeSlot,
                status: order.status,
                price: order.price,
                type: order.type as TypeOrder,
                userId: order.userId,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
            }),
        )

        return {
            orders: orderList,
            total,
            totalPages,
            page,
            limit,
        }
    }

    public async update(order: Partial<OrderEntity>): Promise<void> {
        await this.repository.contract.update({
            where: { id: order.id },
            data: {
                number: order.number,
                local: order.local,
                observation: order.observation,
                price: order.price,
                type: order.type,
                contact: order.contact,
                updatedAt: order.updatedAt,
            },
        })

        return
    }

    public async updateStatus(
        id: string,
        status: Status,
        updatedAt: Date,
    ): Promise<void> {
        await this.repository.contract.update({
            where: { id },
            data: {
                status,
                updatedAt,
            },
        })

        return
    }

    public async deleteGroup(ids: string[]): Promise<void> {
        for (let i = 0; ids.length > i; i++) {
            await this.repository.contract.delete({
                where: { id: ids[i] },
            })

            return
        }

        return
    }

    public async updateScheduling(
        id: string,
        schedulingDate: Date,
        schedulingTime: TimeSlot,
        updatedAt: Date,
    ): Promise<void> {
        await this.repository.contract.update({
            where: { id },
            data: {
                schedulingDate,
                schedulingTime,
                updatedAt,
            },
        })

        return
    }

    public async delete(id: string): Promise<void> {
        await this.repository.contract.delete({
            where: {
                id,
            },
        })

        return
    }
}
