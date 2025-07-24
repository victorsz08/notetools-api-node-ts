import { NoteEntity } from "../entities/note.entity"

export type NoteList = {
    notes: NoteEntity[]
    total: number
    page: number
    limit: number
    totalPages: number
}

export interface NoteInterface {
    create(note: NoteEntity): Promise<void>
    find(id: string): Promise<NoteEntity | null>
    list(page: number, limit: number, userId: string): Promise<NoteList>
    update(
        id: string,
        title: string,
        content: string,
        updatedAt: Date,
    ): Promise<void>
    delete(id: string): Promise<void>
}
