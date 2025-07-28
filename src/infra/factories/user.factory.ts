import { prismaClient } from "@/package/prisma-client/prisma"
import { UserRepositoryPrisma } from "../repositories/user.repository.prisma"
import { CreateUserUsecase } from "@/usecases/user/create.usecase"
import { FindUserUsecase } from "@/usecases/user/find.usecase"
import { ListUserUsecase } from "@/usecases/user/list.usecase"
import { UpdateUserUsecase } from "@/usecases/user/update.usecase"
import { ChangePasswordUsecase } from "@/usecases/user/change-password.usecase"
import { DeleteUserUsecase } from "@/usecases/user/delete.usecase"
import { CreateUserRoute } from "../api/express/routes/user/create.express.route"
import { FindUserRoute } from "../api/express/routes/user/find.express.route"
import { ListUserRoute } from "../api/express/routes/user/list.express.route"
import { UpdateUserRoute } from "../api/express/routes/user/update.express.route"
import { ChangePasswordRoute } from "../api/express/routes/user/change-password.express.route"
import { DeleteUserRoute } from "../api/express/routes/user/delete.express.route"

export const UserFactory = () => {
    const userRepository = UserRepositoryPrisma.build(prismaClient)

    const createUserUsecase = CreateUserUsecase.build(userRepository)
    const findUserUsecase = FindUserUsecase.build(userRepository)
    const listUserUsecase = ListUserUsecase.build(userRepository)
    const updateUserUsecase = UpdateUserUsecase.build(userRepository)
    const changePasswordUserUsecase =
        ChangePasswordUsecase.build(userRepository)
    const deleteUserUsecase = DeleteUserUsecase.build(userRepository)

    const createUserRoute = CreateUserRoute.build(createUserUsecase)
    const findUserRoute = FindUserRoute.build(findUserUsecase)
    const listUserRoute = ListUserRoute.build(listUserUsecase)
    const updateUserRoute = UpdateUserRoute.build(updateUserUsecase)
    const changePasswordUserRoute = ChangePasswordRoute.build(
        changePasswordUserUsecase,
    )
    const deleteUserRoute = DeleteUserRoute.build(deleteUserUsecase)

    return [
        createUserRoute,
        listUserRoute,
        findUserRoute,
        updateUserRoute,
        changePasswordUserRoute,
        deleteUserRoute,
    ]
}
