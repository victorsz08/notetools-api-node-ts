import { UserInterface } from "@/domain/interface/user.interface"
import { UpdateUserInput, UpdateUserUsecase } from "../update.usecase"
import { UserEntity } from "@/domain/entities/user.entity"
import { HttpException } from "@/package/exceptions/http-exceptions"

describe("Update User Usecase", () => {
    let mockUserRepository: jest.Mocked<UserInterface>
    let usecase: UpdateUserUsecase

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
        usecase = UpdateUserUsecase.build(mockUserRepository)
    })

    it("Deve atualizar o usuário com sucesso", async () => {
        const user = await UserEntity.build("teste", "teste", "teste", "teste")
        mockUserRepository.find.mockResolvedValue(user)

        const input: UpdateUserInput = {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
        }

        await expect(usecase.execute(input)).resolves.toBeUndefined()
        expect(mockUserRepository.update).toHaveBeenCalled()
    })

    it("deve lançar exceção se o username já existir", async () => {
        mockUserRepository.findByUsername.mockResolvedValue({} as UserEntity)

        const input: UpdateUserInput = {
            id: "123",
            username: "test",
            firstName: "test",
            lastName: "test",
        }

        await expect(usecase.execute(input)).rejects.toBeInstanceOf(
            HttpException,
        )
        expect(mockUserRepository.update).not.toHaveBeenCalled()
    })
})
