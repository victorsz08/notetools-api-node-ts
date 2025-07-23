import { TypeOrder } from "@/domain/enum/type-order.enum"
import { Usecase } from "../usecase.core"
import { OrderInterface } from "@/domain/interface/order.interface"
import {
    HttpException,
    HttpStatusCode,
} from "@/package/exceptions/http-exceptions"

export type UpdateOrderInput = {
    id: string
    number: number
    local: string
    observation: string
    price: number
    type: TypeOrder
    contact: string
}

export type UpdateOrderOutput = void

export class UpdateOrderUsecase
    implements Usecase<UpdateOrderInput, UpdateOrderOutput>
{
    private constructor(private readonly orderRepository: OrderInterface) {}

    public static build(orderRepository: OrderInterface) {
        return new UpdateOrderUsecase(orderRepository)
    }

    public async execute(input: UpdateOrderInput): Promise<void> {
        const { id, contact, local, number, observation, price, type } = input
        const order = await this.orderRepository.find(id)

        if (!order) {
            throw new HttpException(
                HttpStatusCode.NOT_FOUND,
                "Pedido não encontrado com esse id",
            )
        }

        await this.orderRepository.update({
            id,
            contact,
            local,
            number,
            observation,
            price,
            type,
        })

        return
    }
}
