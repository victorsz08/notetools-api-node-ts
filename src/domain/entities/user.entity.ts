export type User = {
    id: string
    username: string
    firstName: string
    lastName: string
    role: string
    password: string
    createdAt: Date
    updatedAt: Date
}

export class UserEntity {
    private constructor(private readonly props: User) {}

    public static build() {}
}
