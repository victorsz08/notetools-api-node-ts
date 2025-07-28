import { prismaClient } from "@/package/prisma-client/prisma"
import { NoteRepositoryPrisma } from "../repositories/note.repository.prisma"
import { CreateNoteUsecase } from "@/usecases/note/create.usecase"
import { FindNoteUsecase } from "@/usecases/note/find.usecase"
import { ListNoteUsecase } from "@/usecases/note/list.usecase"
import { UpdateNoteUsecase } from "@/usecases/note/update.usecase"
import { DeleteNoteUsecase } from "@/usecases/note/delete.usecase"
import { CreateNoteRoute } from "../api/express/routes/note/create.express.route"
import { FindNoteRoute } from "../api/express/routes/note/find.express.route"
import { UpdateNoteRoute } from "../api/express/routes/note/update.express.route"
import { DeleteNoteRoute } from "../api/express/routes/note/delete.express.route"
import { ListNoteRoute } from "../api/express/routes/note/list.express.route"

export const NoteFactory = () => {
    const noteRepository = NoteRepositoryPrisma.build(prismaClient)

    const createNoteUsecase = CreateNoteUsecase.build(noteRepository)
    const findNoteUsecase = FindNoteUsecase.build(noteRepository)
    const listNoteUsecase = ListNoteUsecase.build(noteRepository)
    const updateNoteUsecase = UpdateNoteUsecase.build(noteRepository)
    const deleteNoteUsecase = DeleteNoteUsecase.build(noteRepository)

    const createNoteRoute = CreateNoteRoute.build(createNoteUsecase)
    const findNoteRoute = FindNoteRoute.build(findNoteUsecase)
    const listNoteRoute = ListNoteRoute.build(listNoteUsecase)
    const updateNoteRoute = UpdateNoteRoute.build(updateNoteUsecase)
    const deleteNoteRoute = DeleteNoteRoute.build(deleteNoteUsecase)

    return [
        createNoteRoute,
        findNoteRoute,
        listNoteRoute,
        updateNoteRoute,
        deleteNoteRoute,
    ]
}
