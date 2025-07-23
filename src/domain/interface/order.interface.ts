import { OrderEntity } from "../entities/order.entity"
import { Status } from "../enum/status.enum"
import { TimeSlot } from "../enum/time-slot.enum"
import { TypeOrder } from "../enum/type-order.enum"

export type OrderListQuery = {
    page: number
    limit: number
    userId: string
    status?: Status
    schedulingDateIn?: Date
    schedulingDateOut?: Date
    createdDateIn?: Date
    createdDateOut?: Date
    type?: TypeOrder
}

export type OrderList = {
    orders: OrderEntity[]
    total: number
    page: number
    limit: number
    totalPages: number
}

export interface OrderInterface {
    create(order: OrderEntity): Promise<void>
    find(id: string): Promise<OrderEntity | null>
    list(query: OrderListQuery): Promise<OrderList>
    update(order: Partial<OrderEntity>): Promise<void>
    updateStatus(id: string, status: Status, updatedAt: Date): Promise<void>
    deleteGroup(ids: string[]): Promise<void>
    updateScheduling(
        id: string,
        schedulingDate: Date,
        schedulingTime: TimeSlot,
        updatedAt: Date,
    ): Promise<void>
    delete(id: string): Promise<void>
}
