import { AuthFactory } from "@/infra/factories/auth.factory"
import { sign } from "jsonwebtoken"
import { Role } from "@/domain/enum/role.enum"
import { UserFactory } from "@/infra/factories/user.factory"
import { ApiExpress } from "../../api.express"
import request from "supertest"
describe("Auth Routes E2E", () => {
    const api = ApiExpress.build([...UserFactory(), ...AuthFactory()])
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
    let userToken: string

    beforeAll(async () => {
        await request(app)
            .post("/users")
            .set("Cookie", `nt.authtoken=${adminToken}`)
            .send({
                username: "test-username",
                firstName: "test",
                lastName: "test",
                password: "Test12345678@",
            })

        const listUserResponse = await request(app)
            .get("/list-users?page=1&limit=10")
            .set("Cookie", `nt.authtoken=${adminToken}`)

        userId = listUserResponse.body.users[0].id
        userToken = sign(
            {
                id: userId,
                role: listUserResponse.body.users[0].role,
            },
            String(process.env.JWT_SECRET),
            { expiresIn: "1d" },
        )
    })

    test("[e2e] Should a be login successfully", async () => {
        const response = await request(app).post("/auth/login").send({
            username: "test-username",
            password: "Test12345678@",
        })

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({})
    })

    test("[e2e] Should a be return a session user successfully", async () => {
        const response = await request(app)
            .get("/auth/session")
            .set("Cookie", `nt.authtoken=${userToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({
            id: expect.any(String),
            username: expect.any(String),
            firstName: expect.any(String),
            lastName: expect.any(String),
            role: expect.any(String),
        })
    })
})
