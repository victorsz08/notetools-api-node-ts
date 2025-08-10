import { prismaClient } from "../../package/prisma-client/prisma"
import { UserRepositoryPrisma } from "../repositories/user.repository.prisma"
import { AuthLoginUsecase } from "../../usecases/auth/login.usecase"
import { AuthLoginRoute } from "../api/express/routes/auth/login.express.route"
import { AuthSessionUsecase } from "../../usecases/auth/session.usecase"
import { AuthSessionRoute } from "../api/express/routes/auth/session.express.route"

export const AuthFactory = () => {
    const userRepository = UserRepositoryPrisma.build(prismaClient)

    const authLoginUsecase = AuthLoginUsecase.build(userRepository)
    const authSessionUsecase = AuthSessionUsecase.build(userRepository)

    const authLoginRoute = AuthLoginRoute.build(authLoginUsecase)
    const authSessionRoute = AuthSessionRoute.build(authSessionUsecase)

    return [authLoginRoute, authSessionRoute]
}
