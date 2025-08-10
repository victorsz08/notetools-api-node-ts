import { NoteEntity } from "../../domain/entities/note.entity"
import { NoteInterface, NoteList } from "../../domain/interface/note.interface"
import { PrismaClient } from "@prisma/client"

export class NoteRepositoryPrisma implements NoteInterface {
    private constructor(private readonly prisma: PrismaClient) {}

    public static build(prisma: PrismaClient) {
        return new NoteRepositoryPrisma(prisma)
    }

    public async create(note: NoteEntity): Promise<void> {
        await this.prisma.notes.create({
            data: {
                id: note.id,
                title: note.title,
                content: note.content,
                user: {
                    connect: {
                        id: note.userId,
                    },
                },
                createdAt: note.createdAt,
                updatedAt: note.updatedAt,
            },
        })

        return
    }

    public async find(id: string): Promise<NoteEntity | null> {
        const note = await this.prisma.notes.findUnique({
            where: { id },
        })

        if (!note) return null

        const output = NoteEntity.with({
            id: note.id,
            title: note.title ?? "",
            content: note.content,
            userId: note.userId,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
        })

        return output
    }

    public async list(
        page: number,
        limit: number,
        userId: string,
    ): Promise<NoteList> {
        const [total, notes] = await Promise.all([
            this.prisma.notes.count({
                where: {
                    user: {
                        id: userId,
                    },
                },
            }),
            this.prisma.notes.findMany({
                where: {
                    user: { id: userId },
                },
                take: limit,
                skip: (page - 1) * limit,
            }),
        ])

        const noteList = notes.map((note) => {
            return NoteEntity.with({
                id: note.id,
                title: note.title ?? "",
                content: note.content,
                userId: note.userId,
                createdAt: note.createdAt,
                updatedAt: note.updatedAt,
            })
        })

        const totalPages = Math.ceil(total / limit)
        return {
            notes: noteList,
            total,
            page,
            limit,
            totalPages,
        }
    }

    public async update(
        id: string,
        title: string,
        content: string,
        updatedAt: Date,
    ): Promise<void> {
        await this.prisma.notes.update({
            where: {
                id,
            },
            data: {
                title,
                content,
                updatedAt,
            },
        })

        return
    }

    public async delete(id: string): Promise<void> {
        await this.prisma.notes.delete({
            where: { id },
        })

        return
    }
}
