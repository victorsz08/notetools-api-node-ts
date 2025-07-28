import { ApiExpress } from "./infra/api/express/api.express"
import { UserFactory } from "./infra/factories/user.factory"

function main() {
    const api = ApiExpress.build([...UserFactory()])
    api.start(3000)
}

main()
