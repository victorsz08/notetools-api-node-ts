/* eslint-disable @typescript-eslint/no-explicit-any */

import { ZodError, z } from "zod"
import { type Request, type Response, type NextFunction } from "express"

type T = Record<any, any>
export function Validation(schema: z.ZodObject<T>) {
    return async (request: Request, response: Response, next: NextFunction) => {
        try {
            const validateToData = request.body
            schema.parse(validateToData)

            next()
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessage = error.issues.map((issue) => {
                    return {
                        path: issue.path,
                        message: issue.message,
                    }
                })

                response.status(401).send({
                    message: "Campos preenchidos incorretamentes",
                    errors: errorMessage,
                })
            }

            response.status(500).send({ message: "erro interno do servidor" })
        }
    }
}
