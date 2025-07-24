import { NoteInterface } from "@/domain/interface/note.interface"
import { CreateNoteUsecase } from "../create.usecase"
import { NoteEntity } from "@/domain/entities/note.entity"

describe("CreateNoteUsecase", () => {
    let mockRepository: jest.Mocked<NoteInterface>
    let usecase: CreateNoteUsecase

    beforeAll(() => {
        mockRepository = {
            create: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
            list: jest.fn(),
            update: jest.fn(),
        }

        usecase = CreateNoteUsecase.build(mockRepository)
    })

    test("deve criar uma anotação com sucesso", async () => {
        const note = NoteEntity.build("test", "test", "test")
        mockRepository.create.mockResolvedValue(undefined)

        const input = {
            title: note.title,
            content: note.content,
            userId: note.userId,
        }

        await usecase.execute(input)
        expect(mockRepository.create).toHaveBeenCalled()
        expect(note.id).toBeDefined()
        expect(note.title).toBeDefined()
        expect(note.content).toBeDefined()
        expect(note.userId).toBeDefined()
        expect(note.createdAt).toBeDefined()
        expect(note.updatedAt).toBeDefined()
    })
})
