import { OrderInterface } from "../../domain/interface/order.interface"
import { Usecase } from "../usecase.core"

export type DeleteGroupOrderInput = {
    ids: string[]
}

export type DeleteGroupOrderOutput = void

export class DeleteGroupOrderUsecase
    implements Usecase<DeleteGroupOrderInput, DeleteGroupOrderOutput>
{
    private constructor(private readonly orderRepository: OrderInterface) {}

    public static build(orderRepository: OrderInterface) {
        return new DeleteGroupOrderUsecase(orderRepository)
    }

    public async execute(input: DeleteGroupOrderInput): Promise<void> {
        const { ids } = input
        await this.orderRepository.deleteGroup(ids)

        return
    }
}
