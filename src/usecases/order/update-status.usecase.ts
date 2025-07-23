import { Status } from "@/domain/enum/status.enum"
import { Usecase } from "../usecase.core"
import { OrderInterface } from "@/domain/interface/order.interface"
import {
    HttpException,
    HttpStatusCode,
} from "@/package/exceptions/http-exceptions"
import { DatePattern } from "@/patterns/date"

export type UpdateStatusOrderInput = {
    id: string
    status: Status
}

export type UpdateStatusOrderOutput = void

export class UpdateStatusOrderUsecase
    implements Usecase<UpdateStatusOrderInput, UpdateStatusOrderOutput>
{
    private constructor(private readonly orderRepository: OrderInterface) {}

    public static build(orderRepository: OrderInterface) {
        return new UpdateStatusOrderUsecase(orderRepository)
    }

    public async execute(input: UpdateStatusOrderInput): Promise<void> {
        const { id, status } = input
        const order = await this.orderRepository.find(id)
        const updatedAt = DatePattern.getCurrentDate()

        if (!order) {
            throw new HttpException(
                HttpStatusCode.NOT_FOUND,
                "Pedido não encontrado com esse id",
            )
        }

        await this.orderRepository.updateStatus(id, status, updatedAt)

        return
    }
}
