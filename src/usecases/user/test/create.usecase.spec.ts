import {
    CreateUserUsecase,
    CreateUserInput,
} from "@/usecases/user/create.usecase"
import { UserInterface } from "@/domain/interface/user.interface"
import { UserEntity } from "@/domain/entities/user.entity"
import { HttpException } from "@/package/exceptions/http-exceptions"

describe("CreateUserUsecase", () => {
    let mockUserRepository: jest.Mocked<UserInterface>
    let usecase: CreateUserUsecase

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
        usecase = CreateUserUsecase.build(mockUserRepository)
    })

    test("deve criar um usuário com sucesso", async () => {
        mockUserRepository.findByUsername.mockResolvedValue(null)
        mockUserRepository.create.mockResolvedValue(undefined)

        const input: CreateUserInput = {
            username: "usuario1",
            fistName: "Nome",
            lastName: "Sobrenome",
            password: "senha123",
        }

        await expect(usecase.execute(input)).resolves.toBeUndefined()
        expect(mockUserRepository.create).toHaveBeenCalled()
    })

    test("deve lançar exceção se o username já existir", async () => {
        mockUserRepository.findByUsername.mockResolvedValue({} as UserEntity)

        const input: CreateUserInput = {
            username: "usuario1",
            fistName: "Nome",
            lastName: "Sobrenome",
            password: "senha123",
        }

        await expect(usecase.execute(input)).rejects.toBeInstanceOf(
            HttpException,
        )
        expect(mockUserRepository.create).not.toHaveBeenCalled()
    })
})
