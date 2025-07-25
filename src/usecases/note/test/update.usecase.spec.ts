import { NoteInterface } from "@/domain/interface/note.interface"
import { UpdateNoteUsecase } from "../update.usecase"
import { NoteEntity } from "@/domain/entities/note.entity"
import {
    HttpException,
    HttpStatusCode,
} from "@/package/exceptions/http-exceptions"

describe("UpdateNoteUsecase", () => {
    let mockRepository: jest.Mocked<NoteInterface>
    let usecase: UpdateNoteUsecase

    beforeAll(() => {
        mockRepository = {
            create: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
            list: jest.fn(),
            update: jest.fn(),
        }

        usecase = UpdateNoteUsecase.build(mockRepository)
    })

    test("deve atualizar uma anotação com sucesso", async () => {
        const note = {} as NoteEntity
        mockRepository.find.mockResolvedValue(note)

        const input = {
            id: "test_id",
            title: "title",
            content: "content",
            updatedAt: expect.any(Date),
        }

        mockRepository.update.mockResolvedValue(undefined)

        await expect(usecase.execute(input)).resolves.toBeUndefined()
        expect(mockRepository.find).toHaveBeenCalledWith(input.id)
    })

    test("deve lançar uma exceção de anotação não encontrada", async () => {
        mockRepository.find.mockResolvedValue(null)
        const input = {
            id: "test_id",
            title: "title",
            content: "content",
            updatedAt: expect.any(Date),
        }

        await expect(usecase.execute(input)).rejects.toThrow(
            new HttpException(
                HttpStatusCode.NOT_FOUND,
                "Anotação não localizada com esse id",
            ),
        )
        expect(mockRepository.find).toHaveBeenCalledWith(input.id)
    })
})
