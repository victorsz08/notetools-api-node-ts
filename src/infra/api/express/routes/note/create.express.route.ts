import { Request, Response, NextFunction } from "express"
import { HttpMethod, Route } from "../route.express"
import { CreateNoteUsecase } from "../../../../../usecases/note/create.usecase"
import { AuthMiddleware } from "../../../../../middleware/auth.middleware"
import { Validation } from "../../../../../middleware/validate-schema"
import { createNoteDto } from "../../../../../package/dtos/note.dto"

export class CreateNoteRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly createNoteUsecase: CreateNoteUsecase,
    ) {}

    public static build(createNoteUsecase: CreateNoteUsecase) {
        return new CreateNoteRoute(
            "/notes/:userId",
            HttpMethod.POST,
            createNoteUsecase,
        )
    }

    public getHandler(): (req: Request, res: Response) => Promise<void> {
        return async (req: Request, res: Response) => {
            const { userId } = req.params
            await this.createNoteUsecase.execute({
                userId,
                ...req.body,
            })

            res.status(201).send()
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
        return [AuthMiddleware(), Validation(createNoteDto)]
    }
}
