import { ApiExpress } from "./infra/api/express/api.express"
import { InsightFactory } from "./infra/factories/insight.factory"
import { NoteFactory } from "./infra/factories/note.factory"
import { Orderfactory } from "./infra/factories/order.factory"
import { UserFactory } from "./infra/factories/user.factory"

function main() {
    const api = ApiExpress.build([
        ...UserFactory(),
        ...Orderfactory(),
        ...NoteFactory(),
        ...InsightFactory(),
    ])
    api.start(3000)
}

main()
