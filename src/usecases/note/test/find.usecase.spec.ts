import { NoteInterface } from "@/domain/interface/note.interface"
import { FindNoteUsecase } from "../find.usecase"
import { NoteEntity } from "@/domain/entities/note.entity"
import {
    HttpException,
    HttpStatusCode,
} from "@/package/exceptions/http-exceptions"

describe("FindNoteUsecase", () => {
    let mockRepository: jest.Mocked<NoteInterface>
    let usecase: FindNoteUsecase

    beforeAll(() => {
        mockRepository = {
            create: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
            list: jest.fn(),
            update: jest.fn(),
        }

        usecase = FindNoteUsecase.build(mockRepository)
    })

    test("deve retornar uma anotação com sucesso", async () => {
        const note = {} as NoteEntity
        mockRepository.find.mockResolvedValue(note)

        const input = {
            id: "test_id",
        }

        const output = {
            id: note.id,
            title: note.title,
            content: note.content,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
        }

        const result = await usecase.execute(input)
        expect(result).toEqual(output)
        expect(mockRepository.find).toHaveBeenCalledWith(input.id)
    })

    test("deve lançar uma exceção de anotação não encontrada", async () => {
        mockRepository.find.mockResolvedValue(null)
        const input = {
            id: "test_id_rejects",
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
