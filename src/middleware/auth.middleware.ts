import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken"

export function AuthMiddleware() {
    return async (request: Request, response: Response, next: NextFunction) => {
        const token = request.cookies["nt.authtoken"]
        if (!token) {
            response.status(403).send({ message: "Token não localizado" })
        }

        try {
            verify(token, String(process.env.JWT_SECRET))
            next()
        } catch (error) {
            response
                .status(401)
                .send({ message: "Usuário não autenticado", error: error })
        }
    }
}
