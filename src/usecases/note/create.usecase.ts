import { NoteInterface } from "../../domain/interface/note.interface"
import { Usecase } from "../usecase.core"
import { NoteEntity } from "../../domain/entities/note.entity"

export type CreateNoteInput = {
    title: string
    content: string
    userId: string
}

export type CreateNoteOutput = void

export class CreateNoteUsecase
    implements Usecase<CreateNoteInput, CreateNoteOutput>
{
    private constructor(private readonly noteRepository: NoteInterface) {}

    public static build(noteRepository: NoteInterface) {
        return new CreateNoteUsecase(noteRepository)
    }

    public async execute(input: CreateNoteInput): Promise<void> {
        const { title, content, userId } = input
        const note = NoteEntity.build(title, content, userId)

        await this.noteRepository.create(note)
        return
    }
}
