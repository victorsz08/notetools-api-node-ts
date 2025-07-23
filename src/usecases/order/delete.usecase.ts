import { OrderInterface } from "@/domain/interface/order.interface"
import { Usecase } from "../usecase.core"
import {
    HttpException,
    HttpStatusCode,
} from "@/package/exceptions/http-exceptions"

export type DeleteOrderInput = {
    id: string
}

export type DeleteOrderOutput = void

export class DeleteOrderUsecase
    implements Usecase<DeleteOrderInput, DeleteOrderOutput>
{
    private constructor(private readonly orderRepository: OrderInterface) {}

    public static build(orderRepository: OrderInterface) {
        return new DeleteOrderUsecase(orderRepository)
    }

    public async execute(input: DeleteOrderInput): Promise<void> {
        const { id } = input
        const order = await this.orderRepository.find(id)

        if (!order) {
            throw new HttpException(
                HttpStatusCode.NOT_FOUND,
                "Pedido não localizado com esse id",
            )
        }

        await this.orderRepository.delete(id)
        return
    }
}
