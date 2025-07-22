import { UserInterface } from "@/domain/interface/user.interface"
import { DeleteUserUsecase } from "../delete.usecase"
import { UserEntity } from "@/domain/entities/user.entity"
import {
    HttpException,
    HttpStatusCode,
} from "@/package/exceptions/http-exceptions"

describe("Delete User Usecase", () => {
    let mockUserRepository: jest.Mocked<UserInterface>
    let usecase: DeleteUserUsecase

    const mockUser = UserEntity.build("teste", "teste", "teste", "teste")

    beforeEach(() => {
        mockUserRepository = {
            create: jest.fn(),
            find: jest.fn(),
            findByUsername: jest.fn(),
            list: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            changePassword: jest.fn(),
        }

        usecase = DeleteUserUsecase.build(mockUserRepository)
    })

    test("deve deletar o usuário com sucesso", async () => {
        mockUserRepository.find.mockResolvedValue(mockUser)
        mockUserRepository.delete.mockResolvedValue(undefined)

        const input = { id: "existing-user-id" }

        await usecase.execute(input)

        expect(mockUserRepository.find).toHaveBeenCalledWith("existing-user-id")
        expect(mockUserRepository.delete).toHaveBeenCalledWith(
            "existing-user-id",
        )
    })

    test("deve lançar uma exceção de usuário não localizado com esse id", async () => {
        mockUserRepository.find.mockResolvedValue(null)

        const input = { id: "non-existent-user-id" }

        await expect(usecase.execute(input)).rejects.toThrow(
            new HttpException(
                HttpStatusCode.NOT_FOUND,
                "usuário não encontrado com esse id",
            ),
        )

        expect(mockUserRepository.find).toHaveBeenCalledWith(
            "non-existent-user-id",
        )
        expect(mockUserRepository.delete).not.toHaveBeenCalled()
    })
})
