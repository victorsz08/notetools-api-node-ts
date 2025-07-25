import { NoteInterface } from "@/domain/interface/note.interface"
import { DeleteNoteUsecase } from "../delete.usecase"
import { NoteEntity } from "@/domain/entities/note.entity"
import {
    HttpException,
    HttpStatusCode,
} from "@/package/exceptions/http-exceptions"

describe("DeleteNoteUsecase", () => {
    let mockRepository: jest.Mocked<NoteInterface>
    let usecase: DeleteNoteUsecase

    beforeAll(() => {
        mockRepository = {
            create: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
            list: jest.fn(),
            update: jest.fn(),
        }

        usecase = DeleteNoteUsecase.build(mockRepository)
    })

    test("deve excluir uma anotação com sucesso", async () => {
        const note = {} as NoteEntity
        mockRepository.find.mockResolvedValue(note)

        const input = {
            id: "test_id",
        }

        mockRepository.delete.mockResolvedValue(undefined)

        await expect(usecase.execute(input)).resolves.toBeUndefined()
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
