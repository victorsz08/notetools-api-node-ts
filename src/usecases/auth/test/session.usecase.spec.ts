import { UserInterface } from "@/domain/interface/user.interface"
import { AuthSessionOutput, AuthSessionUsecase } from "../session.usecase"
import { UserEntity } from "@/domain/entities/user.entity"
import { verify } from "jsonwebtoken"

jest.mock("jsonwebtoken")

describe("AuthSessionUsecase", () => {
    let mockRepository: jest.Mocked<UserInterface>
    let usecase: AuthSessionUsecase

    beforeAll(() => {
        mockRepository = {
            create: jest.fn(),
            changePassword: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
            findByUsername: jest.fn(),
            grantUser: jest.fn(),
            list: jest.fn(),
            update: jest.fn(),
        }

        usecase = AuthSessionUsecase.build(mockRepository)
    })

    test("deve retornar os dados do usuário com sucesso", async () => {
        const input = {
            token: "jwt_token_test",
        }
        const mockUserDecoded = { id: "user_id" } as UserEntity
        const user = {
            id: "user_id",
            username: "testuser",
            firstName: "John",
            lastName: "Doe",
            role: "USER",
        } as UserEntity

        ;(verify as jest.Mock).mockReturnValue(mockUserDecoded)
        mockRepository.find.mockResolvedValue(user)

        const output: AuthSessionOutput = {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        }

        const result = await usecase.execute(input)

        expect(result).toEqual(output)
        expect(mockRepository.find).toHaveBeenCalledWith(mockUserDecoded.id)
    })
})
