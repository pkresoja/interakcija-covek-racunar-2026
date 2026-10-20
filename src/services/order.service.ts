import type { MovieModel } from "@/models/movie.model"
import type { OrderModel } from "@/models/order.model"

const ORDER_KEY = 'icr_2026_orders'

export class OrderService {
    static getOrders(): OrderModel[] {
        if (localStorage.getItem(ORDER_KEY)) {
            localStorage.setItem(ORDER_KEY, JSON.stringify([]))
        }

        return JSON.parse(localStorage.getItem(ORDER_KEY) ?? '[]')
    }

    static createOrder(movieId: number, time: string, seat: string) {
        const orders = this.getOrders()
        orders.push({
            movieId,
            time,
            seat,
            createdAt: new Date().toISOString()
        })

        localStorage.setItem(ORDER_KEY, JSON.stringify(orders))
    }
}