import { ListUser, UserInterface } from "@/domain/interface/user.interface"
import { Usecase } from "../usecase.core"

export type ListUserInput = {
    page: number
    limit: number
    search?: string
}

export type ListUserOutput = {
    users: {
        id: string
        username: string
        firstName: string
        lastName: string
        role: string
        createdAt: Date
        updatedAt: Date
    }[]
    total: number
    page: number
    limit: number
    totalPages: number
}

export class ListUserUsecase implements Usecase<ListUserInput, ListUserOutput> {
    private constructor(private readonly userRepository: UserInterface) {}

    public static build(userRepository: UserInterface) {
        return new ListUserUsecase(userRepository)
    }

    public async execute(input: ListUserInput): Promise<ListUserOutput> {
        const { page, limit, search } = input
        const data = await this.userRepository.list(page, limit, search)

        const output = this.present(data)
        return output
    }

    private present(data: ListUser): ListUserOutput {
        return {
            users: data.users.map((user) => ({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            })),
            total: data.total,
            page: data.page,
            limit: data.limit,
            totalPages: data.totalPages,
        }
    }
}
