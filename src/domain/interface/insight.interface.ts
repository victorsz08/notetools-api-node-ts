export type Insight = {
    sales: number
    revenue: number
    completionRate: number
}

export type InsightStatus = {
    pending: number
    connected: number
    canceled: number
}

export type InsightDaily = {
    quantity: number
    date: Date
}

export interface InsightInterface {
    getInsight(userId: string, startDate: Date, endDate: Date): Promise<Insight>
    getInsightStatus(
        userId: string,
        startDate: Date,
        endDate: Date,
    ): Promise<InsightStatus>
    getInsightDaily(
        userId: string,
        startDate: Date,
        endDate: Date,
    ): Promise<InsightDaily>
}
