import { NoteInterface } from "@/domain/interface/note.interface"
import { Usecase } from "../usecase.core"
import {
    HttpException,
    HttpStatusCode,
} from "@/package/exceptions/http-exceptions"

export type DeleteNoteInput = {
    id: string
}

export type DeleteNoteOutput = void

export class DeleteNoteUsecase
    implements Usecase<DeleteNoteInput, DeleteNoteOutput>
{
    private constructor(private readonly noteRepository: NoteInterface) {}

    public static build(noteRepository: NoteInterface) {
        return new DeleteNoteUsecase(noteRepository)
    }

    public async execute(input: DeleteNoteInput): Promise<void> {
        const { id } = input
        const note = await this.noteRepository.find(id)

        if (!note) {
            throw new HttpException(
                HttpStatusCode.NOT_FOUND,
                "Anotação não localizada com esse id",
            )
        }

        await this.noteRepository.delete(id)
        return
    }
}
