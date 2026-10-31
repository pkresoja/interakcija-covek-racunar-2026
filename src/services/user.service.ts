import type { OrderModel } from "@/models/order.model"
import { MovieService } from "./movie.service"
import type { UserModel } from "@/models/user.mode"

const ORDER_KEY = 'icr_2026_orders'
const USERS_KEY = 'icr_2026_users'
const ACITVE_KEY = 'icr_2026_active'

export class UserService {
    static getUsers(): UserModel[] {
        if (!localStorage.getItem(USERS_KEY)) {
            localStorage.setItem(USERS_KEY, JSON.stringify([{
                firstName: 'Example',
                lastName: 'User',
                email: 'user@example.com',
                password: 'user123',
                genre: 'Drama',
                orders: []
            }]))
        }

        return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]')
    }

    static getOrders(): OrderModel[] {
        if (!localStorage.getItem(ORDER_KEY)) {
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

    static async getOrdersWithMovieObjectIncluded() {
        const orders = this.getOrders()
        const ids = orders.map(o => o.movieId)
        const movies = await MovieService.getMoviesByIds(ids)

        for (let order of orders) {
            for (let movie of movies.data) {
                if (order.movieId == movie.movieId) {
                    order.movie = movie
                }
            }
        }

        return orders
    }

    static login(email: string, password: string): boolean {
        const users = this.getUsers()

        for (let user of users) {
            if (user.email == email && user.password == password) {
                localStorage.setItem(ACITVE_KEY, email)
                return true
            }
        }

        return false
    }

    static getActiveUser(): UserModel | null {
        const users = this.getUsers()

        for (let user of users) {
            if (localStorage.getItem(ACITVE_KEY) == user.email) {
                return user
            }
        }

        return null
    }

    static pay() {
        const orders = this.getOrders()
        orders.forEach(o => o.paidAt = new Date().toISOString())

        const users = this.getUsers()
        for (let user of users) {
            if (localStorage.getItem(ACITVE_KEY) == user.email) {
                user.orders.push(...orders)
            }
        }

        localStorage.setItem(ORDER_KEY, JSON.stringify([]))
        localStorage.setItem(USERS_KEY, JSON.stringify(users))
    }

    static logout() {
        localStorage.removeItem(ACITVE_KEY)
    }
}