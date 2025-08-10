import { TimeSlot } from "../../domain/enum/time-slot.enum"
import { TypeOrder } from "../../domain/enum/type-order.enum"
import { Usecase } from "../usecase.core"
import { OrderInterface } from "../../domain/interface/order.interface"
import { OrderEntity } from "../../domain/entities/order.entity"

export type CreateOrderInput = {
    number: number
    local: string
    observation: string
    schedulingDate: Date
    schedulingTime: TimeSlot
    price: number
    contact: string
    type: TypeOrder
    userId: string
}

export type CreateOrderOutput = void

export class CreateOrderUsecase
    implements Usecase<CreateOrderInput, CreateOrderOutput>
{
    private constructor(private readonly orderRepository: OrderInterface) {}

    public static build(orderRepository: OrderInterface) {
        return new CreateOrderUsecase(orderRepository)
    }

    public async execute(input: CreateOrderInput): Promise<void> {
        const {
            number,
            local,
            observation,
            schedulingDate,
            schedulingTime,
            price,
            contact,
            type,
            userId,
        } = input
        const order = OrderEntity.build(
            number,
            local,
            observation,
            schedulingDate,
            schedulingTime,
            contact,
            type,
            price,
            userId,
        )
        await this.orderRepository.create(order)
        return
    }
}
