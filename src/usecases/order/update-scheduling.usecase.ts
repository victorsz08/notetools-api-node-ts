import { TimeSlot } from "@/domain/enum/time-slot.enum"
import { Usecase } from "../usecase.core"
import { OrderInterface } from "@/domain/interface/order.interface"
import {
    HttpException,
    HttpStatusCode,
} from "@/package/exceptions/http-exceptions"

export type UpdateSchedulingOrderInput = {
    id: string
    schedulingDate: Date
    schedulingTime: TimeSlot
}

export type UpdateSchedulingOrderOutput = void

export class UpdateSchedulingOrderUsecase
    implements Usecase<UpdateSchedulingOrderInput, UpdateSchedulingOrderOutput>
{
    private constructor(private readonly orderRepository: OrderInterface) {}

    public static build(orderRepository: OrderInterface) {
        return new UpdateSchedulingOrderUsecase(orderRepository)
    }

    public async execute(input: UpdateSchedulingOrderInput): Promise<void> {
        const { id, schedulingDate, schedulingTime } = input
        const order = await this.orderRepository.find(id)

        if (!order) {
            throw new HttpException(
                HttpStatusCode.NOT_FOUND,
                "Pedido não encontrado com esse id",
            )
        }

        await this.orderRepository.updateScheduling(
            id,
            schedulingDate,
            schedulingTime,
        )

        return
    }
}
