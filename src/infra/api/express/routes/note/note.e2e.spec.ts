import { UserFactory } from "@/infra/factories/user.factory"
import { ApiExpress } from "../../api.express"
import { NoteFactory } from "@/infra/factories/note.factory"
import request from "supertest"
import { Role } from "@/domain/enum/role.enum"
import { sign } from "jsonwebtoken"

describe("[E2E] Note Route Test", () => {
    const api = ApiExpress.build([...UserFactory(), ...NoteFactory()])
    const app = api.goToApp()
    const token = sign({ id: "user-id", role: Role.ADMIN }, "secret", {
        expiresIn: "1d",
    })
    let userId: string
    let userToken: string
    let noteId: string

    test("[e2e] Should a be create a note successfully", async () => {
        const createUserResponse = await request(app)
            .post("/users")
            .set("Cookie", `nt.authtoken=${token}`)
            .send({
                username: "test-username",
                firstName: "test",
                lastName: "test",
                password: "Test12345678@",
            })

        expect(createUserResponse.status).toBe(201)

        const listUsersResponse = await request(app)
            .get("/list-users?page=1&limit=10")
            .set("Cookie", `nt.authtoken=${token}`)

        expect(listUsersResponse.status).toBe(200)

        userId = listUsersResponse.body.users[0].id

        const response = await request(app)
            .post(`/notes/${userId}`)
            .set("Cookie", `nt.authtoken=${token}`)
            .send({
                title: "test",
                content: "test",
            })

        expect(response.status).toBe(201)
        expect(response.body).toMatchObject({})
    })

    test("[e2e] Should a be list a note successfully", async () => {
        userToken = sign({ id: userId, role: Role.ADMIN }, "secret", {
            expiresIn: "1d",
        })

        const response = await request(app)
            .get(`/list-notes?page=1&limit=10`)
            .set("Cookie", `nt.authtoken=${userToken}`)

        noteId = response.body.notes[0].id

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({
            notes: expect.any(Array),
            total: expect.any(Number),
            page: expect.any(Number),
            limit: expect.any(Number),
            totalPages: expect.any(Number),
        })
    })

    test("[e2e] Should a be find a note successfully", async () => {
        const response = await request(app)
            .get(`/notes/${noteId}`)
            .set("Cookie", `nt.authtoken=${userToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({
            id: expect.any(String),
            title: expect.any(String),
            content: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        })
    })

    test("[e2e] Should a be update a note successfully", async () => {
        const response = await request(app)
            .put(`/notes/${noteId}`)
            .set("Cookie", `nt.authtoken=${userToken}`)
            .send({
                title: "test-update",
                content: "test-update",
            })

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({})
    })

    test("[e2e] Should a be delete note successfully", async () => {
        const response = await request(app)
            .delete(`/notes/${noteId}`)
            .set("Cookie", `nt.authtoken=${userToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({})
    })
})
