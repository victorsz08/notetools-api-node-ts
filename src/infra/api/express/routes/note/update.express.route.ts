import { Request, Response, NextFunction } from "express"
import { HttpMethod, Route } from "../route.express"
import { UpdateNoteUsecase } from "@/usecases/note/update.usecase"
import { AuthMiddleware } from "@/middleware/auth.middleware"
import { Validation } from "@/middleware/validate-schema"
import { updateNoteDto } from "@/package/dtos/note.dto"

export class UpdateNoteRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly updateNoteUsecase: UpdateNoteUsecase,
    ) {}

    public static build(updateNoteUsecase: UpdateNoteUsecase) {
        return new UpdateNoteRoute(
            "/notes/:id",
            HttpMethod.PUT,
            updateNoteUsecase,
        )
    }

    public getHandler(): (req: Request, res: Response) => Promise<void> {
        return async (req: Request, res: Response) => {
            const { id } = req.params
            await this.updateNoteUsecase.execute({ id, ...req.body })

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
        return [AuthMiddleware(), Validation(updateNoteDto)]
    }
}
