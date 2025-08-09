import { UserFactory } from "@/infra/factories/user.factory"
import { ApiExpress } from "../../api.express"
import { SecurityFactory } from "@/infra/factories/security.factory"
import { sign } from "jsonwebtoken"
import { Role } from "@/domain/enum/role.enum"
import request from "supertest"

describe("E2E Security Tests", () => {
    const api = ApiExpress.build([...UserFactory(), ...SecurityFactory()])
    const app = api.goToApp()
    const adminToken = sign(
        {
            id: "admin-id",
            role: Role.ADMIN,
        },
        "secret",
        { expiresIn: "1d" },
    )
    let userId: string

    beforeAll(async () => {
        await request(app)
            .post("/users")
            .set("Cookie", `nt.authtoken=${adminToken}`)
            .send({
                username: "username-test",
                firstName: "test",
                lastName: "test",
                password: "Test123456789@",
            })

        const listUserResponse = await request(app)
            .get("/list-users?page=1&limit=10")
            .set("Cookie", `nt.authtoken=${adminToken}`)

        userId = listUserResponse.body.users[0].id
    })

    test("[e2e] Should a be granted user role successfully", async () => {
        const response = await request(app)
            .put(`/grant-user/${userId}`)
            .set("Cookie", `nt.authtoken=${adminToken}`)
            .send({
                role: Role.ADMIN,
            })

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({})
    })

    test("[e2e] Should a be recovery a password user successfully", async () => {
        const response = await request(app)
            .put(`/recovery-user/${userId}`)
            .set("Cookie", `nt.authtoken=${adminToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({
            newPassword: expect.any(String),
        })
    })
})
