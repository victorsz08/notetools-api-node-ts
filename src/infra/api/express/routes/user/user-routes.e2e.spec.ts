import { Role } from "@/domain/enum/role.enum"
import { sign } from "jsonwebtoken"
import { ApiExpress } from "../../api.express"
import { UserFactory } from "@/infra/factories/user.factory"
import request from "supertest"
import { ListUserOutput } from "@/usecases/user/list.usecase"
import { FindUserOutput } from "@/usecases/user/find.usecase"

describe("User Routes Test E2E", () => {
    const adminToken = sign(
        {
            id: "test_id",
            role: Role.ADMIN,
        },
        String(process.env.JWT_SECRET),
        { expiresIn: "1d" },
    )
    const userToken = sign(
        {
            id: "test_id",
            role: Role.USER,
        },
        String(process.env.JWT_SECRET),
        { expiresIn: "1d" },
    )

    let userId: string

    const api = ApiExpress.build([...UserFactory()])
    const app = api.goToApp()

    test("[e2e] should a be create new user", async () => {
        const input = {
            username: "newUser",
            firstName: "user_test",
            lastName: "user_test",
            password: "Test12345678@",
        }

        const response = await request(app)
            .post("/users")
            .set("Cookie", `nt.authtoken=${adminToken}`)
            .send(input)

        expect(response.status).toBe(201)
        expect(response.body).toMatchObject({})
    })

    test("[e2e] Should a be return list users successfully", async () => {
        const output = {} as ListUserOutput

        const response = await request(app)
            .get("/list-users?page=1&limit=10")
            .set("Cookie", `nt.authtoken=${adminToken}`)

        userId = response.body.users[0].id

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject(output)
    })

    test("[e2e] Should return user with id", async () => {
        const user = {} as FindUserOutput

        const response = await request(app)
            .get(`/users/${userId}`)
            .set("Cookie", `nt.authtoken=${adminToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject(user)
    })

    test("[e2e] Should a be update user", async () => {
        const input = {
            username: "test_user",
            firstName: "teste",
            lastName: "teste",
        }

        const response = await request(app)
            .put(`/users/${userId}`)
            .set("Cookie", `nt.authtoken=${adminToken}`)
            .send(input)

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({})
    })

    test("[e2e] Should a be update password user", async () => {
        const input = {
            currentPassword: "Test12345678@",
            newPassword: "Test12345678@",
        }

        const response = await request(app)
            .put(`/users/update-password/${userId}`)
            .set("Cookie", `nt.authtoken=${adminToken}`)
            .send(input)

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({})
    })

    test("[e2e] Should a be delete user", async () => {
        const response = await request(app)
            .delete(`/users/${userId}`)
            .set("Cookie", `nt.authtoken=${adminToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({})
    })

    test("[e2e] Should return error user not found with id", async () => {
        const response = await request(app)
            .get(`/users/${userId}`)
            .set("Cookie", `nt.authtoken=${adminToken}`)

        expect(response.status).toBe(404)
        expect(response.body).toMatchObject({})
    })

    test("[e2e] Should return error token not found", async () => {
        const input = {
            username: "newUser",
            firstName: "user_test",
            lastName: "user_test",
            password: "Test12345678@",
        }

        const response = await request(app).post("/users").send(input)

        expect(response.status).toBe(403)
        expect(response.body).toMatchObject({})
    })

    test("[e2e] should return error unauthorized user route", async () => {
        const input = {
            username: "newUser",
            firstName: "user_test",
            lastName: "user_test",
            password: "Test12345678@",
        }

        const response = await request(app)
            .post("/users")
            .set("Cookie", `nt.authtoken=${userToken}`)
            .send(input)

        expect(response.status).toBe(401)
        expect(response.body).toMatchObject({})
    })
})
