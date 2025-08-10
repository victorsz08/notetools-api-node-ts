import { Request, Response, NextFunction } from "express"
import { HttpMethod, Route } from "../route.express"
import { DeleteNoteUsecase } from "../../../../../usecases/note/delete.usecase"
import { AuthMiddleware } from "../../../../../middleware/auth.middleware"

export class DeleteNoteRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly deleteNoteUsecase: DeleteNoteUsecase,
    ) {}

    public static build(deleteNoteUsecase: DeleteNoteUsecase) {
        return new DeleteNoteRoute(
            "/notes/:id",
            HttpMethod.DELETE,
            deleteNoteUsecase,
        )
    }

    public getHandler(): (req: Request, res: Response) => Promise<void> {
        return async (req: Request, res: Response) => {
            const { id } = req.params
            await this.deleteNoteUsecase.execute({ id })

            res.status(200).send()
        }
    }

    public getPath(): string {
        return this.path
    }

    public getMethod(): HttpMethod {
        return this.method
    }

    public getMiddleware(): ((
        request: Request,
        response: Response,
        next: NextFunction,
    ) => Promise<void>)[] {
        return [AuthMiddleware()]
    }
}
