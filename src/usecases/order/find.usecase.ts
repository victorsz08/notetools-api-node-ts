import { Status } from "@/domain/enum/status.enum"
import { TimeSlot } from "@/domain/enum/time-slot.enum"
import { TypeOrder } from "@/domain/enum/type-order.enum"
import { Usecase } from "../usecase.core"
import { OrderInterface } from "@/domain/interface/order.interface"
import { OrderEntity } from "@/domain/entities/order.entity"
import {
    HttpException,
    HttpStatusCode,
} from "@/package/exceptions/http-exceptions"

export type FindOrderInput = {
    id: string
}

export type FindOrderOutput = {
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
}

export class FindOrderUsecase
    implements Usecase<FindOrderInput, FindOrderOutput>
{
    private constructor(private readonly orderRepository: OrderInterface) {}

    public static build(orderRepository: OrderInterface) {
        return new FindOrderUsecase(orderRepository)
    }

    public async execute(input: FindOrderInput): Promise<FindOrderOutput> {
        const { id } = input
        const order = await this.orderRepository.find(id)

        if (!order) {
            throw new HttpException(
                HttpStatusCode.NOT_FOUND,
                "Pedido não localizado com esse id",
            )
        }

        const output = this.present(order)
        return output
    }

    private present(order: OrderEntity): FindOrderOutput {
        return {
            id: order.id,
            number: order.number,
            local: order.local,
            observation: order.observation,
            schedulingDate: order.schedulingDate,
            schedulingTime: order.schedulingTime,
            price: order.price,
            status: order.status,
            contact: order.contact,
            type: order.type,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        }
    }
}
