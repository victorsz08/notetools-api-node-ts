import { NoteInterface } from "@/domain/interface/note.interface"
import { Usecase } from "../usecase.core"
import {
    HttpException,
    HttpStatusCode,
} from "@/package/exceptions/http-exceptions"
import { DatePattern } from "@/patterns/date"

export type UpdateNoteInput = {
    id: string
    title: string
    content: string
}

export type UpdateNoteOutput = void

export class UpdateNoteUsecase
    implements Usecase<UpdateNoteInput, UpdateNoteOutput>
{
    private constructor(private readonly noteRepository: NoteInterface) {}

    public static build(noteRepository: NoteInterface) {
        return new UpdateNoteUsecase(noteRepository)
    }

    public async execute(input: UpdateNoteInput): Promise<void> {
        const { id, title, content } = input
        const note = await this.noteRepository.find(id)
        const updatedAt = DatePattern.getCurrentDate()

        if (!note) {
            throw new HttpException(
                HttpStatusCode.NOT_FOUND,
                "Anotação não localizada com esse id",
            )
        }

        await this.noteRepository.update(id, title, content, updatedAt)
        return
    }
}
