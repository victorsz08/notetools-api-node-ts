import { Status } from "../../domain/enum/status.enum"
import { TimeSlot } from "../../domain/enum/time-slot.enum"
import { TypeOrder } from "../../domain/enum/type-order.enum"
import { Usecase } from "../usecase.core"
import {
    OrderInterface,
    OrderList,
} from "../../domain/interface/order.interface"

export type ListOrderInput = {
    page: number
    limit: number
    status?: Status
    type?: TypeOrder
    userId: string
    schedulingDateIn?: Date
    schedulingDateOut?: Date
    createdAtDateIn?: Date
    createdAtDateOut?: Date
}

export type ListOrderOutput = {
    orders: {
        id: string
        number: number
        local: string
        observation: string
        schedulingDate: Date
        schedulingTime: TimeSlot
        price: number
        contact: string
        status: Status
        type: TypeOrder
        createdAt: Date
        updatedAt: Date
    }[]
    total: number
    page: number
    limit: number
    totalPages: number
}

export class ListOrderUsecase
    implements Usecase<ListOrderInput, ListOrderOutput>
{
    private constructor(private readonly orderRepository: OrderInterface) {}

    public static build(orderRepository: OrderInterface) {
        return new ListOrderUsecase(orderRepository)
    }

    public async execute(input: ListOrderInput): Promise<ListOrderOutput> {
        const data = await this.orderRepository.list(input)
        const output = this.present(data)

        return output
    }

    private present(data: OrderList): ListOrderOutput {
        return {
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
    }
}
