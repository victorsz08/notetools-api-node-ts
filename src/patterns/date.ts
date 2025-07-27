import moment from "moment-timezone"

export class DatePattern {
    public static getCurrentDate(): Date {
        return moment().tz("America/Sao_Paulo").toDate()
    }

    public static format(date: Date): string {
        return moment(date)
            .tz("America/Sao_Paulo")
            .format("YYYY-MM-DD HH:mm:ss")
    }

    public static addMonth(date: Date, month: number): Date {
        return moment(date).add(month, "month").toDate()
    }

    public static subMonth(date: Date, month: number): Date {
        return moment(date).subtract(month, "month").toDate()
    }
}
