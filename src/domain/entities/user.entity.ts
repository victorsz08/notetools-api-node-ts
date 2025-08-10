import { Role } from "../../domain/enum/role.enum"
import { DatePattern } from "../../patterns/date"
import { Hash } from "../../patterns/hash"
import { RandomId } from "../../patterns/random-id"

export type User = {
    id: string
    username: string
    firstName: string
    lastName: string
    role: Role
    password: string
    createdAt: Date
    updatedAt: Date
}

export class UserEntity {
    private constructor(private readonly props: User) {}

    public static async build(
        username: string,
        firstName: string,
        lastName: string,
        password: string,
    ) {
        const id = RandomId.uuid()
        const createdAt = DatePattern.getCurrentDate()
        const updatedAt = DatePattern.getCurrentDate()
        const passwordHash = await Hash.hash(password)

        const user: User = {
            id,
            username,
            firstName,
            lastName,
            role: Role.USER,
            password: passwordHash,
            createdAt,
            updatedAt,
        }

        return new UserEntity(user)
    }

    public static with(props: User) {
        return new UserEntity(props)
    }

    public get id(): string {
        return this.props.id
    }
    public get username(): string {
        return this.props.username
    }
    public get firstName(): string {
        return this.props.firstName
    }
    public get lastName(): string {
        return this.props.lastName
    }
    public get role(): Role {
        return this.props.role
    }
    public get password(): string {
        return this.props.password
    }
    public get createdAt(): Date {
        return this.props.createdAt
    }
    public get updatedAt(): Date {
        return this.props.updatedAt
    }
}
