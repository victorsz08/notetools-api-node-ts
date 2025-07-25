import { NoteInterface } from "@/domain/interface/note.interface"
import { ListNoteUsecase } from "../list.usecase"

describe("ListNoteUsecase", () => {
    let mockRepository: jest.Mocked<NoteInterface>
    let usecase: ListNoteUsecase

    beforeAll(() => {
        mockRepository = {
            create: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
            list: jest.fn(),
            update: jest.fn(),
        }

        usecase = ListNoteUsecase.build(mockRepository)
    })

    test("deve retornar uma lista de anotações com sucesso", async () => {
        const data = {
            notes: [],
            page: 1,
            limit: 1,
            total: 1,
            totalPages: 1,
        }

        mockRepository.list.mockResolvedValue(data)
        const input = {
            page: 1,
            limit: 10,
            userId: "test_id",
        }

        const result = await usecase.execute(input)
        expect(result).toEqual(data)
        expect(mockRepository.list).toHaveBeenCalled()
    })
})
