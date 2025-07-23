import { ApiExpress } from "./infra/api/express/api.express"

function main() {
    const api = ApiExpress.build([])
    api.start(3000)
}

main()
