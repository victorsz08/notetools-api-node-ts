import { UserInterface } from "@/domain/interface/user.interface"
import { AuthLoginUsecase } from "../login.usecase"
import { UserEntity } from "@/domain/entities/user.entity"
import {
    HttpException,
    HttpStatusCode,
} from "@/package/exceptions/http-exceptions"
import { Hash } from "@/patterns/hash"
import { sign } from "jsonwebtoken"
import { Role } from "@/domain/enum/role.enum"

jest.mock("jsonwebtoken", () => ({
    sign: jest.fn(() => "mocked-jwt-token"),
}))

jest.mock("@/patterns/hash", () => ({
    Hash: {
        compare: jest.fn(),
    },
}))

describe("AuthLoginUsecase", () => {
    let mockRepository: jest.Mocked<UserInterface>
    let usecase: AuthLoginUsecase

    beforeEach(() => {
        mockRepository = {
            find: jest.fn(),
            changePassword: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            findByUsername: jest.fn(),
            list: jest.fn(),
            update: jest.fn(),
        } as jest.Mocked<UserInterface>

        usecase = AuthLoginUsecase.build(mockRepository)
        ;(sign as jest.Mock).mockClear()
        ;(Hash.compare as jest.Mock).mockClear()
    })

    test("should return a token on successful login", async () => {
        const mockUser = {
            id: "user-id-123",
            username: "testuser",
            password: "hashedpassword",
            role: "USER",
            createdAt: new Date(),
            updatedAt: new Date(),
        } as UserEntity

        mockRepository.findByUsername.mockResolvedValue(mockUser)
        ;(Hash.compare as jest.Mock).mockResolvedValue(true)
        ;(sign as jest.Mock).mockReturnValue("mocked-jwt-token-for-test")

        const input = {
            username: "testuser",
            password: "correctpassword",
        }

        const result = await usecase.execute(input)

        expect(mockRepository.findByUsername).toHaveBeenCalledWith(
            input.username,
        )
        expect(Hash.compare).toHaveBeenCalledWith(
            input.password,
            mockUser.password,
        )
        expect(sign).toHaveBeenCalledWith(
            { id: mockUser.id, role: mockUser.role },
            String(process.env.JWT_SECRET),
            { expiresIn: "15m" },
        )
        expect(result).toEqual({ token: "mocked-jwt-token-for-test" })
    })

    test("should throw HttpException for incorrect username", async () => {
        mockRepository.findByUsername.mockResolvedValue(null) // User not found

        const input = {
            username: "nonexistentuser",
            password: "anypassword",
        }

        await expect(usecase.execute(input)).rejects.toThrow(HttpException)
        await expect(usecase.execute(input)).rejects.toHaveProperty(
            "message",
            "Username ou senha incorretos",
        )
        await expect(usecase.execute(input)).rejects.toHaveProperty(
            "statusCode",
            HttpStatusCode.BAD_REQUEST,
        )
        expect(mockRepository.findByUsername).toHaveBeenCalledWith(
            input.username,
        )
        expect(Hash.compare).not.toHaveBeenCalled() // Should not try to compare password if user not found
        expect(sign).not.toHaveBeenCalled() // Should not try to sign a token
    })

    test("should throw HttpException for incorrect password", async () => {
        const mockUser = {
            id: "user-id-123",
            username: "testuser",
            password: "hashedpassword",
            role: "USER" as Role,
            createdAt: new Date(),
            updatedAt: new Date(),
        } as UserEntity

        mockRepository.findByUsername.mockResolvedValue(mockUser)
        ;(Hash.compare as jest.Mock).mockResolvedValue(false)

        const input = {
            username: "testuser",
            password: "wrongpassword",
        }

        await expect(usecase.execute(input)).rejects.toThrow(HttpException)
        await expect(usecase.execute(input)).rejects.toHaveProperty(
            "message",
            "Username ou senha incorretos",
        )
        await expect(usecase.execute(input)).rejects.toHaveProperty(
            "statusCode",
            HttpStatusCode.BAD_REQUEST,
        )
        expect(mockRepository.findByUsername).toHaveBeenCalledWith(
            input.username,
        )
        expect(Hash.compare).toHaveBeenCalledWith(
            input.password,
            mockUser.password,
        )
        expect(sign).not.toHaveBeenCalled()
    })
})
