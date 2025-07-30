import { prismaClient } from "@/package/prisma-client/prisma"
import { UserRepositoryPrisma } from "../repositories/user.repository.prisma"
import { RecoveryUserUsecase } from "@/usecases/security/recovery-user.usecase"
import { RecoveryUserRoute } from "../api/express/routes/security/recovery-user.express.route"
import { GrantUserUsecase } from "@/usecases/security/grant-user.usecase"
import { GrantUserRoute } from "../api/express/routes/security/grant-user.express.route"

export const SecurityFactory = () => {
    const userRepository = UserRepositoryPrisma.build(prismaClient)

    const recoveryUserUsecase = RecoveryUserUsecase.build(userRepository)
    const grantUserUsecase = GrantUserUsecase.build(userRepository)

    const recoveryUserRoute = RecoveryUserRoute.build(recoveryUserUsecase)
    const grantUserRoute = GrantUserRoute.build(grantUserUsecase)

    return [recoveryUserRoute, grantUserRoute]
}
