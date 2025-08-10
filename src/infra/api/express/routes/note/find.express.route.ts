import { FindNoteUsecase } from "../../../../../usecases/note/find.usecase"
import { HttpMethod, Route } from "../route.express"
import { Request, Response, NextFunction } from "express"
import { AuthMiddleware } from "../../../../../middleware/auth.middleware"

export class FindNoteRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly findNoteUsecase: FindNoteUsecase,
    ) {}

    public static build(findNoteUsecase: FindNoteUsecase) {
        return new FindNoteRoute("/notes/:id", HttpMethod.GET, findNoteUsecase)
    }

    public getHandler(): (req: Request, res: Response) => Promise<void> {
        return async (req: Request, res: Response) => {
            const { id } = req.params
            const output = await this.findNoteUsecase.execute({ id })

            res.status(200).send(output)
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
