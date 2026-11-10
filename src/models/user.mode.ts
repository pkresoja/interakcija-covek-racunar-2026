import type { OrderModel } from "./order.model"

export interface UserModel {
    firstName: string
    lastName: string
    email: string,
    password: string,
    genreId: number,
    orders: OrderModel[]
}