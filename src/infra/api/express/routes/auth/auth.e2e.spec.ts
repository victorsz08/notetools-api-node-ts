import { AuthFactory } from "@/infra/factories/auth.factory"
import { ApiExpress } from "../../api.express"
import { sign } from "jsonwebtoken"
import { Role } from "@/domain/enum/role.enum"
import request from "supertest"
import { UserFactory } from "@/infra/factories/user.factory"
describe("Auth Routes E2E", () => {
    const api = ApiExpress.build([...AuthFactory(), ...UserFactory()])
    const app = api.goToApp()
    const adminToken = sign(
        {
            id: "admin-id",
            role: Role.ADMIN,
        },
        String(process.env.JWT_SECRET),
        { expiresIn: "1d" },
    )

    test("[e2e] Should a be login successfully", async () => {
        const createUserResponse = await request(app)
            .post("/users")
            .set("Cookie", `nt.authtoken=${adminToken}`)
            .send({
                username: "test-username",
                firstName: "test",
                lastName: "test",
                password: "Test12345678@",
            })

        expect(createUserResponse.status).toBe(201)

        const response = await request(app).post("/auth/login").send({
            username: "test-username",
            password: "Test12345678@",
        })

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({})
    })
})
