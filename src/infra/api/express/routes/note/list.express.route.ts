import { Request, Response, NextFunction } from "express"
import { HttpMethod, Route } from "../route.express"
import { ListNoteUsecase } from "@/usecases/note/list.usecase"
import { listNoteDto } from "@/package/dtos/note.dto"
import { verify } from "jsonwebtoken"
import { UserEntity } from "@/domain/entities/user.entity"
import { AuthMiddleware } from "@/middleware/auth.middleware"

export class ListNoteRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly listNoteUsecase: ListNoteUsecase,
    ) {}

    public static build(listNoteUsecase: ListNoteUsecase) {
        return new ListNoteRoute("/list-notes", HttpMethod.GET, listNoteUsecase)
    }

    public getHandler(): (req: Request, res: Response) => Promise<void> {
        return async (req: Request, res: Response) => {
            const input = listNoteDto.parse(req.query)
            const token = req.cookies["nt.authtoken"]
            const user = verify(
                token,
                String(process.env.JWT_SECRET),
            ) as UserEntity

            const output = await this.listNoteUsecase.execute({
                userId: user.id,
                ...input,
            })
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
