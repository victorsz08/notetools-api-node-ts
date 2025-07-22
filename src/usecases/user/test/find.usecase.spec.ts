import { UserInterface } from "@/domain/interface/user.interface"
import { FindUserInput, FindUserOutput, FindUserUsecase } from "../find.usecase"
import { UserEntity } from "@/domain/entities/user.entity"
import { HttpException } from "@/package/exceptions/http-exceptions"

describe("FindUserUsecase", () => {
    let mockUserRepository: jest.Mocked<UserInterface>
    let usecase: FindUserUsecase

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
        usecase = FindUserUsecase.build(mockUserRepository)
    })

    test("deve buscar um usuário pelo id", async () => {
        const user = await UserEntity.build("teste", "teste", "teste", "teste")
        mockUserRepository.find.mockResolvedValue(user)

        const input: FindUserInput = {
            id: user.id,
        }

        const result = await usecase.execute(input)
        const outputUser: FindUserOutput = {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
        expect(result).toEqual(outputUser)
        expect(mockUserRepository.find).toHaveBeenCalledWith(input.id)
    })

    test("deve lançar um erro se o usuário não for encontrado", async () => {
        mockUserRepository.find.mockResolvedValue(null)

        const input: FindUserInput = {
            id: "123",
        }

        await expect(usecase.execute(input)).rejects.toBeInstanceOf(
            HttpException,
        )
    })
})
