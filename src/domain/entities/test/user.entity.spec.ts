import { Role } from "@/domain/enum/role.enum"
import { UserEntity } from "../user.entity"

describe("UserEntity", () => {
    test("deve criar um usuário com sucesso", async () => {
        const props = {
            username: "test.doe",
            firstName: "jonh",
            lastName: "doe",
            password: "12345678",
        }

        const user = await UserEntity.build(
            props.username,
            props.firstName,
            props.lastName,
            props.password,
        )

        expect(user.id).toBeDefined()
        expect(user.createdAt).toBeDefined()
        expect(user.updatedAt).toBeDefined()
        expect(user.role).toBe(Role.USER)
    })
})
