import type { OrderModel } from "./order.model"

export interface UserModel {
    firstName: string
    lastName: string
    email: string,
    password: string,
    genre: string,
    orders: OrderModel[]
}