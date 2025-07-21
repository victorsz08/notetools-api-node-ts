export type HttpStatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 409 | 500
export const HttpStatusCode = {
    OK: 200 as HttpStatusCode,
    CREATED: 201 as HttpStatusCode,
    BAD_REQUEST: 400 as HttpStatusCode,
    UNAUTHORIZED: 401 as HttpStatusCode,
    FORBIDDEN: 403 as HttpStatusCode,
    NOT_FOUND: 404 as HttpStatusCode,
    CONFLICT: 409 as HttpStatusCode,
    INTERNAL_SERVER_ERROR: 500 as HttpStatusCode,
} as const

export class HttpException extends Error {
    public statusCode: HttpStatusCode
    constructor(statusCode: HttpStatusCode, message: string) {
        ;(super(message), (this.statusCode = statusCode))
    }
}
