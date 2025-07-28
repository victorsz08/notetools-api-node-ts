/* eslint-disable @typescript-eslint/no-explicit-any */
import { NoteEntity } from "@/domain/entities/note.entity"
import { NoteRepositoryPrisma } from "../note.repository.prisma"

const mockPrisma = {
    notes: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
} as any
describe("NoteRepsitoryPrisma", () => {
    const mockNoteRepositoryPrisma = NoteRepositoryPrisma.build(mockPrisma)

    beforeAll(() => {
        jest.clearAllMocks()
    })

    test("deve criar uma anotação com sucesso", async () => {
        const note = NoteEntity.build("test", "teste", "uder_id_test")
        await mockNoteRepositoryPrisma.create(note)

        expect(mockPrisma.notes.create).toHaveBeenCalledWith({
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
    })

    test("deve retornar uma anotação com sucesso", async () => {
        const id = "test_id"
        const note = {
            id: "teste",
            title: "teste",
            content: "teste",
            userId: "teste",
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        }

        mockPrisma.notes.findUnique.mockResolvedValueOnce(note)

        const noteEntity = NoteEntity.with(note)
        const result = await mockNoteRepositoryPrisma.find(id)

        expect(result).toEqual(noteEntity)
        expect(mockPrisma.notes.findUnique).toHaveBeenCalledWith({
            where: {
                id: id,
            },
        })
    })

    test("deve retornar uma lista de anotações com sucesso", async () => {
        const input = {
            page: 1,
            limit: 10,
            userId: "test_id",
        }

        const listNotes = [
            {
                id: "teste",
                title: "teste",
                content: "teste",
                userId: "teste",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: "teste",
                title: "teste",
                content: "teste",
                userId: "teste",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]
        mockPrisma.notes.count.mockResolvedValueOnce(1)
        mockPrisma.notes.findMany.mockResolvedValueOnce(listNotes)

        const output = {
            notes: listNotes.map((note) => {
                return NoteEntity.with(note)
            }),
            page: input.page,
            limit: input.limit,
            total: 1,
            totalPages: 1,
        }

        const result = await mockNoteRepositoryPrisma.list(
            input.page,
            input.limit,
            input.userId,
        )

        expect(result).toEqual(output)
        expect(mockPrisma.notes.findMany).toHaveBeenCalledWith({
            where: {
                user: { id: input.userId },
            },
            take: input.limit,
            skip: (input.page - 1) * input.limit,
        })
    })

    test("deve atualizar uma anotação com sucesso", async () => {
        const input = {
            id: "test_id",
            title: "test",
            content: "test",
            updatedAt: new Date(),
        }

        mockPrisma.notes.update.mockResolvedValue(undefined)
        await mockNoteRepositoryPrisma.update(
            input.id,
            input.title,
            input.content,
            input.updatedAt,
        )

        expect(mockPrisma.notes.update).toHaveBeenCalledWith({
            where: {
                id: input.id,
            },
            data: {
                title: input.title,
                content: input.content,
                updatedAt: input.updatedAt,
            },
        })
    })

    test("deve excluir uma anotação com sucesso", async () => {
        const id = "test_id"
        mockPrisma.notes.delete.mockResolvedValue(undefined)

        await mockNoteRepositoryPrisma.delete(id)
        expect(mockPrisma.notes.delete).toHaveBeenCalledWith({
            where: {
                id: id,
            },
        })
    })

    test("deve retornar uma exceção se não encontrar uma anotação", async () => {
        const id = "test_id"
        mockPrisma.notes.findUnique.mockResolvedValueOnce(null)

        const result = await mockNoteRepositoryPrisma.find(id)

        expect(result).toBeNull()
        expect(mockPrisma.notes.findUnique).toHaveBeenCalledWith({
            where: {
                id: id,
            },
        })
    })
})
