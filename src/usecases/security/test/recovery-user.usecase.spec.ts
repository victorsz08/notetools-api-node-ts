import { UserInterface } from "@/domain/interface/user.interface"
import { RecoveryUserUsecase } from "../recovery-user.usecase"
import { UserEntity } from "@/domain/entities/user.entity"
import { Hash } from "@/patterns/hash"
import {
    HttpException,
    HttpStatusCode,
} from "@/package/exceptions/http-exceptions"

describe("RecoveryUserUsecase", () => {
    let mockRepository: jest.Mocked<UserInterface>
    let usecase: RecoveryUserUsecase

    beforeAll(() => {
        mockRepository = {
            create: jest.fn(),
            changePassword: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
            findByUsername: jest.fn(),
            list: jest.fn(),
            update: jest.fn(),
        }

        usecase = RecoveryUserUsecase.build(mockRepository)
    })

    test("deve alterar a senha e retornar uma senha aleatória com sucesso", async () => {
        const input = {
            id: "test_id",
        }
        const user = {} as UserEntity

        mockRepository.find.mockResolvedValueOnce(user)
        mockRepository.changePassword.mockResolvedValueOnce(undefined)

        const result = await usecase.execute(input)

        expect(result.newPassword).toBeDefined()
        expect(mockRepository.find).toHaveBeenCalledWith(input.id)
    })

    test("deve lançar uma exceção de usuário não encontrado", async () => {
        const input = {
            id: "id_notfound",
        }

        mockRepository.find.mockResolvedValue(null)

        await expect(usecase.execute(input)).rejects.toThrow(
            new HttpException(
                HttpStatusCode.NOT_FOUND,
                "Usuário não localizado com esse id",
            ),
        )
        expect(mockRepository.find).toHaveBeenCalledWith(input.id)
    })
})
