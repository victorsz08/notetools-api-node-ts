import { ListUser, UserInterface } from "@/domain/interface/user.interface"
import { ListUserUsecase } from "../list.usecase"
import { UserEntity } from "@/domain/entities/user.entity"

describe("List User Usecase", () => {
    let mockUserRepository: jest.Mocked<UserInterface>
    let usecase: ListUserUsecase

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
        usecase = ListUserUsecase.build(mockUserRepository)
    })

    test("should list users successfully", async () => {
        const mockUsers: ListUser = {
            users: [] as UserEntity[],
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 1,
        }
        mockUserRepository.list.mockResolvedValue(mockUsers)
        const input = {
            page: 1,
            limit: 10,
        }

        const result = await usecase.execute(input)

        expect(result).toEqual(mockUsers)
        expect(mockUserRepository.list).toHaveBeenCalled()
    })
})
