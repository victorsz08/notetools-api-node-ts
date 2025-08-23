import { prismaClient } from "../../package/prisma-client/prisma"
import { UserRepositoryPrisma } from "../repositories/user.repository.prisma"
import { AuthLoginUsecase } from "../../usecases/auth/login.usecase"
import { AuthLoginRoute } from "../api/express/routes/auth/login.express.route"
import { AuthSessionUsecase } from "../../usecases/auth/session.usecase"
import { AuthSessionRoute } from "../api/express/routes/auth/session.express.route"
import { AuthRefreshUsecase } from "../../usecases/auth/refresh.usecase"
import { AuthRefreshRoute } from "../api/express/routes/auth/refresh.express.route"

export const AuthFactory = () => {
    const userRepository = UserRepositoryPrisma.build(prismaClient)

    const authLoginUsecase = AuthLoginUsecase.build(userRepository)
    const authSessionUsecase = AuthSessionUsecase.build(userRepository)
    const authRefreshUsecase = AuthRefreshUsecase.build(userRepository)

    const authLoginRoute = AuthLoginRoute.build(authLoginUsecase)
    const authSessionRoute = AuthSessionRoute.build(authSessionUsecase)
    const authRefreshRoute = AuthRefreshRoute.build(authRefreshUsecase)

    return [authLoginRoute, authSessionRoute, authRefreshRoute]
}
