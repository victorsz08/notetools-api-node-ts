import { Status } from "@/domain/enum/status.enum"
import {
    Insight,
    InsightDaily,
    InsightInterface,
    InsightStatus,
} from "@/domain/interface/insight.interface"
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

        const connected = orders.filter((order) => order.status === "CONECTADO")
        const canceled = orders.filter((order) => order.status === "CANCELADO")
        const sales = orders.length

        const revenue = connected.reduce((total, item) => total + item.price, 0)
        const completionRate = Number(
            ((connected.length + canceled.length) / connected.length).toFixed(
                2,
            ),
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
        const orders = await this.prisma.contract.groupBy({
            by: ["createdAt"],
            where: {
                user: { id: userId },
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            _count: {
                id: true,
            },
        })

        const dailyMap: InsightDaily[] = orders.map((order) => {
            return {
                quantity: order._count.id,
                date: order.createdAt,
            }
        })

        return dailyMap
    }
}
