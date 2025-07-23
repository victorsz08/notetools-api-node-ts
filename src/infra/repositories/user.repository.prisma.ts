import { UserEntity } from "@/domain/entities/user.entity"
import { Role } from "@/domain/enum/role.enum"
import { ListUser, UserInterface } from "@/domain/interface/user.interface"
import { Prisma, PrismaClient } from "@prisma/client"

export class UserRepositoryPrisma implements UserInterface {
    private constructor(private readonly repository: PrismaClient) {}

    public static build(repository: PrismaClient) {
        return new UserRepositoryPrisma(repository)
    }

    public async create(user: UserEntity): Promise<void> {
        await this.repository.user.create({
            data: {
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                password: user.password,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        })

        return
    }

    public async find(id: string): Promise<UserEntity | null> {
        const user = await this.repository.user.findUnique({
            where: { id },
        })

        if (!user) return null
        const output = UserEntity.with({
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role as Role,
            password: user.password,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        })

        return output
    }

    public async findByUsername(username: string): Promise<UserEntity | null> {
        const user = await this.repository.user.findUnique({
            where: { username },
        })
        if (!user) return null

        const output = UserEntity.with({
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role as Role,
            password: user.password,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        })

        return output
    }

    public async list(
        page: number,
        limit: number,
        search?: string,
    ): Promise<ListUser> {
        const query: Prisma.UserFindManyArgs = {
            where: {},
            take: limit,
            skip: (page - 1) * limit,
        }

        const count: Prisma.UserCountArgs = {
            where: {},
        }

        if (search) {
            query.where = {
                AND: [
                    { username: { contains: search, mode: "insensitive" } },
                    { firstName: { contains: search, mode: "insensitive" } },
                    { lastName: { contains: search, mode: "insensitive" } },
                ],
            }

            count.where = {
                AND: [
                    { username: { contains: search, mode: "insensitive" } },
                    { firstName: { contains: search, mode: "insensitive" } },
                    { lastName: { contains: search, mode: "insensitive" } },
                ],
            }
        }
        const [total, users] = await Promise.all([
            this.repository.user.count(count),
            this.repository.user.findMany(query),
        ])

        const totalPages = Math.ceil(total / limit)
        const userList = users.map((user) =>
            UserEntity.with({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role as Role,
                password: user.password,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }),
        )
        return {
            users: userList,
            total,
            page,
            limit,
            totalPages,
        }
    }

    public async update(
        id: string,
        username: string,
        firstName: string,
        lastName: string,
        updatedAt: Date,
    ): Promise<void> {
        await this.repository.user.update({
            where: { id },
            data: {
                username,
                firstName,
                lastName,
                updatedAt,
            },
        })

        return
    }

    public async delete(id: string): Promise<void> {
        await this.repository.user.delete({
            where: { id },
        })

        return
    }

    public async changePassword(
        id: string,
        password: string,
        updatedAt: Date,
    ): Promise<void> {
        await this.repository.user.update({
            where: { id },
            data: {
                password,
                updatedAt,
            },
        })

        return
    }
}
