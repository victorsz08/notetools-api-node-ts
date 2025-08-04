import { Api } from "../api"
import express, { Express } from "express"
import { Route } from "./routes/route.express"
import CookieParser from "cookie-parser"
import cors from "cors"
import swaggerUi from "swagger-ui-express"
import swaggerJson from "@/docs.swagger.json"

export class ApiExpress implements Api {
    private app: Express

    private constructor(routes: Route[]) {
        this.app = express()

        this.app.use(express.json())
        this.app.use(CookieParser())
        this.app.use(
            cors({
                origin: ["http://localhost:5173"],
                allowedHeaders: "Content-type, Authorization",
                methods: ["POST", "PUT", "GET", "DELETE", "OPTIONS"],
                credentials: true,
            }),
        )

        this.addRoutes(routes)
        this.addLogs(routes)
        this.app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerJson))
    }

    public static build(routes: Route[]) {
        return new ApiExpress(routes)
    }

    public goToApp() {
        return this.app
    }

    private addRoutes(routes: Route[]) {
        routes.forEach((route) => {
            const handler = route.getHandler()
            const path = route.getPath()
            const method = route.getMethod()
            const middleware = route.getMiddleware()

            this.app[method](path, ...middleware, handler)
        })
    }

    private addLogs(routes: Route[]) {
        routes.forEach((route) => {
            const method = route.getMethod().toUpperCase()
            const path = route.getPath()
            console.info(`\x1b[32m[${method}\x1b[0m]: ${path}`)
        })
    }

    public start(port: number): void {
        this.app.listen(port, () => {
            console.info(
                `[\x1b[32mINFO\x1b[0m]: Server http is running in port: ${port}`,
            )
        })
    }
}
