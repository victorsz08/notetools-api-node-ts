import { NoteInterface } from "../../domain/interface/note.interface"
import { Usecase } from "../usecase.core"
import { NoteEntity } from "../../domain/entities/note.entity"
import {
    HttpException,
    HttpStatusCode,
} from "../../package/exceptions/http-exceptions"

export type FindNoteInput = {
    id: string
}

export type FindNoteOutput = {
    id: string
    title: string
    content: string
    createdAt: Date
    updatedAt: Date
}

export class FindNoteUsecase implements Usecase<FindNoteInput, FindNoteOutput> {
    private constructor(private readonly noteRepository: NoteInterface) {}

    public static build(noteRepository: NoteInterface) {
        return new FindNoteUsecase(noteRepository)
    }

    public async execute(input: FindNoteInput): Promise<FindNoteOutput> {
        const { id } = input
        const note = await this.noteRepository.find(id)

        if (!note) {
            throw new HttpException(
                HttpStatusCode.NOT_FOUND,
                "Anotação não localizada com esse id",
            )
        }

        const output = this.present(note)
        return output
    }

    private present(note: NoteEntity): FindNoteOutput {
        return {
            id: note.id,
            title: note.title,
            content: note.content,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
        }
    }
}
