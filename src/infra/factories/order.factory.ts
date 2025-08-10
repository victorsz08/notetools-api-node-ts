import { prismaClient } from "../../package/prisma-client/prisma"
import { OrderRepositoryPrisma } from "../repositories/order.repository.prisma"
import { CreateOrderUsecase } from "../../usecases/order/create.usecase"
import { FindOrderUsecase } from "../../usecases/order/find.usecase"
import { ListOrderUsecase } from "../../usecases/order/list.usecase"
import { UpdateOrderUsecase } from "../../usecases/order/update.usecase"
import { UpdateStatusOrderUsecase } from "../../usecases/order/update-status.usecase"
import { UpdateSchedulingOrderUsecase } from "../../usecases/order/update-scheduling.usecase"
import { DeleteOrderUsecase } from "../../usecases/order/delete.usecase"
import { CreateOrderRoute } from "../api/express/routes/order/create.express.route"
import { ListOrderRoute } from "../api/express/routes/order/list.express.route"
import { UpdateOrderRoute } from "../api/express/routes/order/update.express.route"
import { UpdateStatusOrderRoute } from "../api/express/routes/order/update-status.express.route"
import { UpdateSchedulingOrderRoute } from "../api/express/routes/order/update-scheduling.express.route"
import { DeleteOrderRoute } from "../api/express/routes/order/delete.express.route"
import { FindOrderRoute } from "../api/express/routes/order/find.express.route"

export const Orderfactory = () => {
    const orderRepository = OrderRepositoryPrisma.build(prismaClient)

    const createOrderUsecase = CreateOrderUsecase.build(orderRepository)
    const findOrderUsecase = FindOrderUsecase.build(orderRepository)
    const listOrderUsecase = ListOrderUsecase.build(orderRepository)
    const updateOrderUsecase = UpdateOrderUsecase.build(orderRepository)
    const updateStatusOrderUsecase =
        UpdateStatusOrderUsecase.build(orderRepository)
    const updateSchedulingOrderUsecase =
        UpdateSchedulingOrderUsecase.build(orderRepository)
    const deleteOrderUsecase = DeleteOrderUsecase.build(orderRepository)

    const createOrderRoute = CreateOrderRoute.build(createOrderUsecase)
    const findOrderRoute = FindOrderRoute.build(findOrderUsecase)
    const listOrderRoute = ListOrderRoute.build(listOrderUsecase)
    const updateOrderRoute = UpdateOrderRoute.build(updateOrderUsecase)
    const updateStatusOrderRoute = UpdateStatusOrderRoute.build(
        updateStatusOrderUsecase,
    )
    const updateSchedulingOrderRoute = UpdateSchedulingOrderRoute.build(
        updateSchedulingOrderUsecase,
    )
    const deleteOrderRoute = DeleteOrderRoute.build(deleteOrderUsecase)

    return [
        createOrderRoute,
        findOrderRoute,
        listOrderRoute,
        updateOrderRoute,
        updateStatusOrderRoute,
        updateSchedulingOrderRoute,
        deleteOrderRoute,
    ]
}
