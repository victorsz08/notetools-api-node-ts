import { UserInterface } from "@/domain/interface/user.interface"
import { ChangePasswordUsecase } from "../change-password.usecase"
import { UserEntity } from "@/domain/entities/user.entity"
import { Hash } from "@/patterns/hash"
import {
    HttpException,
    HttpStatusCode,
} from "@/package/exceptions/http-exceptions"
import { DatePattern } from "@/patterns/date"

describe("Change Password User Usecase", () => {
    let mockUserRepository: jest.Mocked<UserInterface>
    let usecase: ChangePasswordUsecase

    const mockUser = {
        id: "some-id",
        username: "testuser",
        firstName: "teste",
        lastName: "teste",
        role: "USER",
        password: "hashedCurrentPassword",
        createdAt: new Date(),
        updatedAt: new Date(),
    } as UserEntity

    beforeEach(() => {
        mockUserRepository = {
            create: jest.fn(),
            find: jest.fn(),
            findByUsername: jest.fn(),
            list: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            changePassword: jest.fn(),
            grantUser: jest.fn(),
        }
        usecase = ChangePasswordUsecase.build(mockUserRepository)

        jest.spyOn(Hash, "compare").mockResolvedValue(true)
        jest.spyOn(Hash, "hash").mockResolvedValue("hashedNewPassword")
        jest.spyOn(DatePattern, "getCurrentDate").mockReturnValue(
            new Date("2025-07-21T10:00:00Z"),
        )
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    test("deve alterar a senha do usuário com sucesso", async () => {
        mockUserRepository.find.mockResolvedValue(mockUser)

        const input = {
            id: "some-id",
            currentPassword: "currentPassword123",
            newPassword: "newPassword123",
        }

        await usecase.execute(input)

        expect(mockUserRepository.find).toHaveBeenCalledWith("some-id")
        expect(Hash.compare).toHaveBeenCalledWith(
            "currentPassword123",
            "hashedCurrentPassword",
        )
        expect(Hash.hash).toHaveBeenCalledWith("newPassword123")
        expect(mockUserRepository.changePassword).toHaveBeenCalledWith(
            "some-id",
            "hashedNewPassword",
            new Date("2025-07-21T10:00:00Z"),
        )
    })

    test("Deve lançar uma exceção de usuário não localizado com esse id", async () => {
        mockUserRepository.find.mockResolvedValue(null)

        const input = {
            id: "non-existent-id",
            currentPassword: "anyPassword",
            newPassword: "newPassword",
        }

        await expect(usecase.execute(input)).rejects.toThrow(
            new HttpException(
                HttpStatusCode.NOT_FOUND,
                "usuário não encontrado com esse id",
            ),
        )
        expect(mockUserRepository.find).toHaveBeenCalledWith("non-existent-id")
        expect(Hash.compare).not.toHaveBeenCalled()
        expect(Hash.hash).not.toHaveBeenCalled()
        expect(mockUserRepository.changePassword).not.toHaveBeenCalled()
    })

    test("deve lançar uma exceção de senha atual invalida", async () => {
        mockUserRepository.find.mockResolvedValue(mockUser)
        jest.spyOn(Hash, "compare").mockResolvedValue(false) // Simulate invalid current password

        const input = {
            id: "some-id",
            currentPassword: "wrongCurrentPassword",
            newPassword: "newPassword123",
        }

        await expect(usecase.execute(input)).rejects.toThrow(
            new HttpException(
                HttpStatusCode.UNAUTHORIZED,
                "senha atual inválida",
            ),
        )
        expect(mockUserRepository.find).toHaveBeenCalledWith("some-id")
        expect(Hash.compare).toHaveBeenCalledWith(
            "wrongCurrentPassword",
            "hashedCurrentPassword",
        )
        expect(Hash.hash).not.toHaveBeenCalled()
        expect(mockUserRepository.changePassword).not.toHaveBeenCalled()
    })
})
