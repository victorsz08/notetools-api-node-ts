import { RandomId } from "../../patterns/random-id"
import { Status } from "../enum/status.enum"
import { TimeSlot } from "../enum/time-slot.enum"
import { DatePattern } from "../../patterns/date"
import { TypeOrder } from "../enum/type-order.enum"

export type Order = {
    id: string
    number: number
    local: string
    observation: string
    schedulingDate: Date
    schedulingTime: TimeSlot
    status: Status
    contact: string
    type: TypeOrder
    price: number
    userId: string
    createdAt: Date
    updatedAt: Date
}

export class OrderEntity {
    private constructor(private readonly props: Order) {}

    public static build(
        number: number,
        local: string,
        observation: string,
        schedulingDate: Date,
        schedulingTime: TimeSlot,
        contact: string,
        type: TypeOrder,
        price: number,
        userId: string,
    ) {
        return new OrderEntity({
            id: RandomId.uuid(),
            number,
            local,
            observation,
            schedulingDate,
            schedulingTime,
            status: Status.PENDING,
            contact,
            price,
            type,
            userId,
            createdAt: DatePattern.getCurrentDate(),
            updatedAt: DatePattern.getCurrentDate(),
        })
    }

    public static with(props: Order) {
        return new OrderEntity(props)
    }

    public get id() {
        return this.props.id
    }

    public get number() {
        return this.props.number
    }

    public get local() {
        return this.props.local
    }

    public get observation() {
        return this.props.observation
    }

    public get schedulingDate() {
        return this.props.schedulingDate
    }

    public get schedulingTime() {
        return this.props.schedulingTime
    }

    public get status() {
        return this.props.status
    }

    public get contact() {
        return this.props.contact
    }

    public get type() {
        return this.props.type
    }

    public get price() {
        return this.props.price
    }

    public get userId() {
        return this.props.userId
    }

    public get createdAt() {
        return this.props.createdAt
    }

    public get updatedAt() {
        return this.props.updatedAt
    }
}
