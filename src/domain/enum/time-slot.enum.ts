export type TimeSlot =
    | "08:00 - 12:00"
    | "08:00 - 19:00"
    | "12:00 - 15:00"
    | "12:00 - 18:00"
    | "15:00 - 18:00"
export const TimeSlot = {
    MORNING: "08:00 - 12:00" as TimeSlot,
    FULL_DAY: "08:00 - 19:00" as TimeSlot,
    MORNING_EVENING: "12:00 - 15:00" as TimeSlot,
    EVENING: "12:00 - 18:00" as TimeSlot,
    FULL_DAY_EVENING: "15:00 - 18:00" as TimeSlot,
} as const
