import { Status } from "@/domain/enum/status.enum"
import { TimeSlot } from "@/domain/enum/time-slot.enum"
import { TypeOrder } from "@/domain/enum/type-order.enum"
import z from "zod"

export const createOrderDto = z.object({
    number: z.coerce
        .number()
        .min(1, "O numero do pedido deve ser maior que zero"),
    local: z.string().nonempty("O campo local é obrigatório"),
    observation: z.string().optional().default("Nenhuma observação"),
    schedulingDate: z.coerce.date(),
    schedulingTime: z.enum(TimeSlot),
    contact: z.string().nonempty("O campo contato é obrigatório"),
    price: z.coerce.number().min(0, "O preço deve ser maior ou igual a zero"),
    type: z.enum(TypeOrder),
})

export const updateOrderDto = z.object({
    number: z.coerce
        .number()
        .min(1, "O numero do pedido deve ser maior que zero"),
    local: z.string().nonempty("O campo local é obrigatório"),
    observation: z.string().optional().default("Nenhuma observação"),
    contact: z.string().nonempty("O campo contato é obrigatório"),
    price: z.coerce.number().min(0, "O preço deve ser maior ou igual a zero"),
    type: z.enum(TypeOrder),
})

export const updateSchedulingOrderDto = z.object({
    schedulingDate: z.coerce.date(),
    schedulingTime: z.enum(TimeSlot),
})

export const updateStatusOrderDto = z.object({
    status: z.enum(Status),
})

export const listOrderDto = z.object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10),
    status: z.enum(Status).optional(),
    type: z.enum(TypeOrder).optional(),
    createdDateIn: z.coerce.date().optional(),
    createdDateOut: z.coerce.date().optional(),
    schedulingDateIn: z.coerce.date().optional(),
    schedulingDateOut: z.coerce.date().optional(),
})
