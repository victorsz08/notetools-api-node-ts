import { prismaClient } from "@/package/prisma-client/prisma"
import { UserRepositoryPrisma } from "../repositories/user.repository.prisma"
import { AuthLoginUsecase } from "@/usecases/auth/login.usecase"
import { AuthLoginRoute } from "../api/express/routes/auth/login.express.route"

export const AuthFactory = () => {
    const userRepository = UserRepositoryPrisma.build(prismaClient)

    const authLoginUsecase = AuthLoginUsecase.build(userRepository)

    const authLoginRoute = AuthLoginRoute.build(authLoginUsecase)

    return [authLoginRoute]
}
