import { UserRepositoryPrisma } from "../user.repository.prisma"
import { UserEntity } from "@/domain/entities/user.entity"
import { Role } from "@/domain/enum/role.enum"

const mockPrisma = {
    user: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    /* eslint-disable @typescript-eslint/no-explicit-any */
} as any

describe("UserRepositoryPrisma", () => {
    let repository: UserRepositoryPrisma

    beforeAll(() => {
        repository = UserRepositoryPrisma.build(mockPrisma)
    })

    test("deve criar um usuário com sucesso", async () => {
        const input = UserEntity.with({
            id: "1",
            username: "teste",
            firstName: "Test",
            lastName: "User",
            role: "ADMIN",
            password: "senha",
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        await repository.create(input)
        expect(mockPrisma.user.create).toHaveBeenCalledWith({
            data: {
                id: input.id,
                username: input.username,
                firstName: input.firstName,
                lastName: input.lastName,
                role: input.role,
                password: input.password,
                createdAt: input.createdAt,
                updatedAt: input.updatedAt,
            },
        })
    })

    test("deve retornar um usuário com sucesso", async () => {
        const prismaUser = {
            id: "1245",
            username: "teste",
            firstName: "Test",
            lastName: "User",
            role: "ADMIN",
            password: "senha",
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        mockPrisma.user.findUnique.mockResolvedValue(prismaUser)

        const result = await repository.find(prismaUser.id)

        expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: prismaUser.id },
        })

        expect(result).toEqual(
            UserEntity.with({
                id: prismaUser.id,
                username: prismaUser.username,
                firstName: prismaUser.firstName,
                lastName: prismaUser.lastName,
                role: prismaUser.role as Role,
                password: prismaUser.password,
                createdAt: prismaUser.createdAt,
                updatedAt: prismaUser.updatedAt,
            }),
        )
    })

    test("deve atualizar um usuário com sucesso", async () => {
        const id = "1"
        const username = "novoUser"
        const firstName = "Novo"
        const lastName = "Nome"
        const updatedAt = new Date()

        mockPrisma.user.update = jest.fn().mockResolvedValue(undefined)

        await repository.update(id, username, firstName, lastName, updatedAt)
        expect(mockPrisma.user.update).toHaveBeenCalledWith({
            where: { id },
            data: { username, firstName, lastName, updatedAt },
        })
    })

    test("deve deletar um usuário com sucesso", async () => {
        const id = "2"
        mockPrisma.user.delete = jest.fn().mockResolvedValue(undefined)

        await repository.delete(id)
        expect(mockPrisma.user.delete).toHaveBeenCalledWith({
            where: { id },
        })
    })

    test("deve alterar a senha do usuário com sucesso", async () => {
        const id = "3"
        const password = "novaSenha"
        const updatedAt = new Date()
        mockPrisma.user.update = jest.fn().mockResolvedValue(undefined)

        await repository.changePassword(id, password, updatedAt)
        expect(mockPrisma.user.update).toHaveBeenCalledWith({
            where: { id },
            data: { password, updatedAt },
        })
    })

    test("deve listar usuários com sucesso", async () => {
        const page = 1
        const limit = 2
        const search = "test"
        const users = [
            {
                id: "1",
                username: "user1",
                firstName: "Primeiro",
                lastName: "Um",
                role: Role.ADMIN,
                password: "senha1",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: "2",
                username: "user2",
                firstName: "Segundo",
                lastName: "Dois",
                role: Role.USER,
                password: "senha2",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]
        mockPrisma.user.findMany.mockResolvedValue(users)
        mockPrisma.user.count = jest.fn().mockResolvedValue(users.length)

        const result = await repository.list(page, limit, search)

        expect(mockPrisma.user.count).toHaveBeenCalled()
        expect(mockPrisma.user.findMany).toHaveBeenCalled()
        expect(result.users).toHaveLength(2)
        expect(result.total).toBe(2)
        expect(result.page).toBe(page)
        expect(result.limit).toBe(limit)
        expect(result.totalPages).toBe(1)
        expect(result.users[0]).toBeInstanceOf(UserEntity)
    })
})
