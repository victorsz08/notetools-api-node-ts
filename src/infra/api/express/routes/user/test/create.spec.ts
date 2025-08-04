import request from "supertest"
import { ApiExpress } from "../../../api.express"
import { UserFactory } from "@/infra/factories/user.factory"
import { Express } from "express"
import { sign } from "jsonwebtoken"
import { Role } from "@/domain/enum/role.enum"
import { FindUserOutput } from "@/usecases/user/find.usecase"

describe("User Routes", () => {
    const api = ApiExpress.build(UserFactory())
    let app: Express
    let adminToken: string

    beforeAll(() => {
        app = api.goToApp()

        const payload = sign(
            {
                id: "admin-tester",
                role: Role.ADMIN,
            },
            String(process.env.JWT_SECRET),
            { expiresIn: "1d" },
        )

        adminToken = payload
    })

    afterAll(() => {
        jest.clearAllMocks()
    })

    test("should a be create a new user", async () => {
        const input = {
            username: "test_id",
            firstName: "test",
            lastName: "test",
            password: "Test12345678@",
        }

        const response = await request(app)
            .post("/users")
            .set("Cookie", [`nt.authtoken=${adminToken}`])
            .send(input)

        expect(response.status).toBe(201)
        expect(response.body).toHaveBeenCalledWith(input)
    })

    test("should a be find user successfully", async () => {
        const userOutput = {} as FindUserOutput

        const response = await request(app)
            .get("/users/test-id")
            .set("Cookie", [`nt.authtoken=${adminToken}`])

        expect(response.status).toEqual(200)
        expect(response.body).toEqual(userOutput)
    })
})
