import { Orderfactory } from "@/infra/factories/order.factory"
import { ApiExpress } from "../../api.express"
import { UserFactory } from "@/infra/factories/user.factory"
import { sign } from "jsonwebtoken"
import { Role } from "@/domain/enum/role.enum"
import request from "supertest"
import { TimeSlot } from "@/domain/enum/time-slot.enum"
import { TypeOrder } from "@/domain/enum/type-order.enum"
import { Status } from "@/domain/enum/status.enum"

describe("E2E Order Tests", () => {
    const api = ApiExpress.build([...Orderfactory(), ...UserFactory()])
    const app = api.goToApp()
    const adminToken = sign({ id: "admin-id", role: Role.ADMIN }, "secret", {
        expiresIn: "1d",
    })
    let userId: string
    let userToken: string
    let orderId: string

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
        userToken = sign({ id: userId, role: Role.ADMIN }, "secret", {
            expiresIn: "1d",
        })
    })

    test("[e2e] Should a be create a order successfully", async () => {
        const response = await request(app)
            .post(`/orders/${userId}`)
            .set("Cookie", `nt.authtoken=${userToken}`)
            .send({
                number: 12345678,
                local: "Country test",
                observation: "obs test",
                schedulingDate: new Date().toISOString(),
                schedulingTime: TimeSlot.MORNING,
                price: 99.9,
                contact: "00 00000-0000",
                type: TypeOrder.PROSPECT,
            })

        expect(response.status).toBe(201)
        expect(response.body).toMatchObject({})
    })

    test("[e2e] Should a be list a order successfully", async () => {
        const response = await request(app)
            .get(`/list-orders?page=1&limit=10`)
            .set("Cookie", `nt.authtoken=${userToken}`)

        orderId = response.body.orders[0].id

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({
            orders: expect.any(Array),
            total: expect.any(Number),
            page: expect.any(Number),
            limit: expect.any(Number),
            totalPages: expect.any(Number),
        })
    })

    test("[e2e] Should a be find a order successfully", async () => {
        const response = await request(app)
            .get(`/orders/${orderId}`)
            .set("Cookie", `nt.authtoken=${userToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({
            id: expect.any(String),
            number: expect.any(Number),
            local: expect.any(String),
            observation: expect.any(String),
            schedulingDate: expect.any(String),
            schedulingTime: expect.any(String),
            status: expect.any(String),
            price: expect.any(Number),
            contact: expect.any(String),
            type: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        })
    })

    test("[e2e] Should a be update a order successfully", async () => {
        const response = await request(app)
            .put(`/orders/${orderId}`)
            .set("Cookie", `nt.authtoken=${userToken}`)
            .send({
                number: 1234568,
                local: "country test",
                observation: "obs test",
                price: 99.8,
                contact: "88 888888888",
                type: TypeOrder.BASE,
            })

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({})
    })

    test("[e2e] Should a be update a status order successfully", async () => {
        const response = await request(app)
            .put(`/orders/update-status/${orderId}`)
            .set("Cookie", `nt.authtoken=${userToken}`)
            .send({
                status: Status.CONNECTED,
            })

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({})
    })

    test("[e2e] Should a be update a scheduling order successfully", async () => {
        const response = await request(app)
            .put(`/orders/update-scheduling/${orderId}`)
            .set("Cookie", `nt.authtoken=${userToken}`)
            .send({
                schedulingDate: new Date().toISOString(),
                schedulingTime: TimeSlot.FULL_DAY_EVENING,
            })

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({})
    })

    test("[e2e] Should a be delete a order successfully", async () => {
        const response = await request(app)
            .delete(`/orders/${orderId}`)
            .set("Cookie", `nt.authtoken=${userToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({})
    })
})
