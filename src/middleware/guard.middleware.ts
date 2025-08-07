import { UserEntity } from "@/domain/entities/user.entity"
import { Role } from "@/domain/enum/role.enum"
import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken"

export function GuardMiddleware(role: Role) {
    return async (request: Request, response: Response, next: NextFunction) => {
        const token = request.cookies["nt.authtoken"]
        if (!token) {
            response.status(403).send({ message: "Token não localizado" })
        }

        try {
            const decoded = verify(
                token,
                String(process.env.JWT_SECRET),
            ) as UserEntity
            if (decoded.role !== role) {
                response.status(401).send({
                    message: "Usuário sem autorização para acessar essa rota",
                })
            }
            next()
        } catch (error) {
            response
                .status(401)
                .send({ message: "Usuário não autenticado", error: error })
        }
    }
}
