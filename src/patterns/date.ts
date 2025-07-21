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
}
