import { UserInterface } from "@/domain/interface/user.interface"
import { GrantUserUsecase } from "../grant-user.usecase"
import { Role } from "@/domain/enum/role.enum"
import { UserEntity } from "@/domain/entities/user.entity"
import {
    HttpException,
    HttpStatusCode,
} from "@/package/exceptions/http-exceptions"

describe("GrantUserUsecase", () => {
    let mockRepository: jest.Mocked<UserInterface>
    let usecase: GrantUserUsecase

    beforeAll(() => {
        mockRepository = {
            create: jest.fn(),
            changePassword: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
            findByUsername: jest.fn(),
            list: jest.fn(),
            update: jest.fn(),
            grantUser: jest.fn(),
        }
        usecase = GrantUserUsecase.build(mockRepository)
    })

    test("deve alterar o cargo do usuário com sucesso", async () => {
        const mockUser = {} as UserEntity
        const input = {
            id: "test_id",
            role: Role.ADMIN,
        }

        mockRepository.find.mockResolvedValueOnce(mockUser)
        mockRepository.grantUser.mockResolvedValueOnce(undefined)

        await usecase.execute(input)

        expect(mockRepository.find).toHaveBeenCalledWith(input.id)
        expect(mockRepository.grantUser).toHaveBeenCalledWith(
            input.id,
            input.role,
        )
    })

    test("deve lançar uma exceção de usuário não localizado", async () => {
        const input = {
            id: "test_id",
            role: Role.ADMIN,
        }

        mockRepository.find.mockResolvedValue(null)

        await expect(usecase.execute(input)).rejects.toThrow(
            new HttpException(
                HttpStatusCode.NOT_FOUND,
                "Usuário não encontrado com esse id",
            ),
        )
        expect(mockRepository.find).toHaveBeenCalledWith(input.id)
    })
})
