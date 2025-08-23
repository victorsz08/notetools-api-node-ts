import { HttpException } from "@/package/exceptions/http-exceptions"
import { NextFunction, Request, Response } from "express"

export function HttpHandleExceptions(
    error: Error & Partial<HttpException>,
    request: Request,
    response: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
) {
    const statusCode = error.statusCode ?? 500
    const message = error.message ?? "erro interno do servidor"

    return response.status(statusCode).json({ message: message })
}
