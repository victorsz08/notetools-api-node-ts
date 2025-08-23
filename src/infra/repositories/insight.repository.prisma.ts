import { Status } from "../../domain/enum/status.enum"
import {
    Insight,
    InsightDaily,
    InsightInterface,
    InsightStatus,
} from "../../domain/interface/insight.interface"
import { PrismaClient } from "@prisma/client"

export class InsightRepositoryPrisma implements InsightInterface {
    private constructor(private readonly prisma: PrismaClient) {}

    public static build(prisma: PrismaClient) {
        return new InsightRepositoryPrisma(prisma)
    }

    public async getInsight(
        userId: string,
        startDate: Date,
        endDate: Date,
    ): Promise<Insight> {
        const orders = await this.prisma.contract.findMany({
            where: {
                user: {
                    id: userId,
                },
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        })

        const schedulingOrders = await this.prisma.contract.findMany({
            where: {
                user: {
                    id: userId,
                },
                schedulingDate: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        })

        const sales = orders.length

        const connectedSchedulingOrders = schedulingOrders.filter(
            (order) => order.status === "CONECTADO",
        )
        const canceledSchedulingOrders = orders.filter(
            (order) => order.status === "CANCELADO",
        )

        const revenue = connectedSchedulingOrders.reduce(
            (total, item) => total + item.price,
            0,
        )
        const completionRate = Number(
            (
                connectedSchedulingOrders.length /
                (connectedSchedulingOrders.length +
                    canceledSchedulingOrders.length)
            ).toFixed(2),
        )

        return {
            sales,
            completionRate,
            revenue,
        }
    }

    public async getInsightStatus(
        userId: string,
        startDate: Date,
        endDate: Date,
    ): Promise<InsightStatus> {
        const [connected, pending, canceled] = await Promise.all([
            this.prisma.contract.count({
                where: {
                    user: { id: userId },
                    status: Status.CONNECTED,
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            }),

            this.prisma.contract.count({
                where: {
                    user: { id: userId },
                    status: Status.PENDING,
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            }),

            this.prisma.contract.count({
                where: {
                    user: { id: userId },
                    status: Status.CANCELLED,
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            }),
        ])

        return {
            connected,
            canceled,
            pending,
        }
    }

    public async getInsightDaily(
        userId: string,
        startDate: Date,
        endDate: Date,
    ): Promise<InsightDaily[]> {
        const orders = await this.prisma.$queryRaw<
            { date: string; quantity: number }[]
        >`
            SELECT DATE("createdAt") as date, COUNT(id) as quantity
            FROM "Contract"
            WHERE "userId" = ${userId}
            AND "createdAt" BETWEEN ${startDate} AND ${endDate}
            GROUP BY DATE("createdAt")
            ORDER BY date ASC;
            `

        const result: InsightDaily[] = orders.map((order) => ({
            date: new Date(order.date),
            quantity: Number(order.quantity),
        }))

        return result
    }
}
