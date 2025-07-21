import { v4 as uuid } from "uuid"

export class RandomId {
    public static uuid(): string {
        return uuid()
    }
}
