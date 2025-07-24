import { HttpException } from "@/package/exceptions/http-exceptions"
import { NextFunction, Request, Response } from "express"

export function HttpHandleExceptions() {
    return async (
        request: Request,
        response: Response,
        next: NextFunction,
        error: Error & Partial<HttpException>,
    ) => {
        const statusCode = error.statusCode ?? 500
        const message = error.message ?? "erro interno do servidor"

        return response.status(statusCode).send({ message: message })
    }
}
