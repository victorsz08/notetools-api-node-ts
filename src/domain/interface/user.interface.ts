import { UserEntity } from "domain/entities/user.entity"

export type ListUserOutput = {
    users: UserEntity[]
    total: number
    page: number
    limit: number
    totalPages: number
}

export interface UserInterface {
    create(user: UserEntity): Promise<void>
    find(id: string): Promise<UserEntity | null>
    findByUsername(username: string): Promise<UserEntity | null>
    list(page: number, limit: number, search?: string): Promise<ListUserOutput>
    update(
        id: string,
        username: string,
        firstName: string,
        lastName: string,
        updatedAt: Date,
    ): Promise<void>
    delete(id: string): Promise<void>
    changePassword(id: string, password: string, updatedAt: Date): Promise<void>
}
