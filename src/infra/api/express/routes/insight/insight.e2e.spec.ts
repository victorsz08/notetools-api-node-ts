import { UserFactory } from "@/infra/factories/user.factory"
import { ApiExpress } from "../../api.express"
import { InsightFactory } from "@/infra/factories/insight.factory"
import { sign } from "jsonwebtoken"
import request from "supertest"
import { Role } from "@/domain/enum/role.enum"
import { GetInsightOutput } from "@/usecases/insight/insight.usecase"
import { GetInsightDailyOutput } from "@/usecases/insight/insight-daily.usecase"
import { GetInsightStatusOutput } from "@/usecases/insight/insight-status.usecase"

describe("E2E Insight Tests", () => {
    const api = ApiExpress.build([...UserFactory(), ...InsightFactory()])
    const app = api.goToApp()
    const adminToken = sign({ id: "admin-id", role: Role.ADMIN }, "secret", {
        expiresIn: "1d",
    })
    let userId: string
    let userToken: string

    test("[e2e] Should a be get insight successfully", async () => {
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
        userToken = sign({ id: userId, role: Role.ADMIN }, "secret", {
            expiresIn: "1d",
        })

        const output = {} as GetInsightOutput
        const response = await request(app)
            .get("/insights?startDate=2025-02-01&endDate=2025-02-28")
            .set("Cookie", `nt.authtoken=${userToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject(output)
    })

    test("[e2e] Should a be get insight daily successfully", async () => {
        const response = await request(app)
            .get("/insight-daily?startDate=2025-02-01&endDate=2025-02-28")
            .set("Cookie", `nt.authtoken=${userToken}`)

        const output = {} as GetInsightDailyOutput
        expect(response.status).toBe(200)
        expect(response.body).toMatchObject(output)
    })

    test("[e2e] Should a be get insight status successfully", async () => {
        const response = await request(app)
            .get("/insight-status?startDate=2025-02-01&endDate=2025-02-28")
            .set("Cookie", `nt.authtoken=${userToken}`)

        const output = {} as GetInsightStatusOutput

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject(output)
    })
})
