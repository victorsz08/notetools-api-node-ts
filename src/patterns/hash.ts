import { hash, compare } from "bcryptjs"

export class Hash {
    public static async hash(plain: string): Promise<string> {
        return hash(plain, 10)
    }

    public static async compare(
        plain: string,
        hashed: string,
    ): Promise<boolean> {
        return compare(plain, hashed)
    }
}
