import { NoteInterface, NoteList } from "../../domain/interface/note.interface"
import { Usecase } from "../usecase.core"

export type ListNoteInput = {
    page: number
    limit: number
    userId: string
}

export type ListNoteOutput = {
    notes: {
        id: string
        title: string
        content: string
        createdAt: Date
        updatedAt: Date
    }[]
    total: number
    page: number
    limit: number
    totalPages: number
}

export class ListNoteUsecase implements Usecase<ListNoteInput, ListNoteOutput> {
    private constructor(private readonly noteRepository: NoteInterface) {}

    public static build(noteRepository: NoteInterface) {
        return new ListNoteUsecase(noteRepository)
    }

    public async execute(input: ListNoteInput): Promise<ListNoteOutput> {
        const { page, limit, userId } = input
        const data = await this.noteRepository.list(page, limit, userId)

        const output = this.present(data)
        return output
    }

    private present(data: NoteList): ListNoteOutput {
        return {
            notes: data.notes.map((note) => {
                return {
                    id: note.id,
                    title: note.title,
                    content: note.content,
                    createdAt: note.createdAt,
                    updatedAt: note.updatedAt,
                }
            }),
            total: data.total,
            page: data.page,
            limit: data.limit,
            totalPages: data.totalPages,
        }
    }
}
