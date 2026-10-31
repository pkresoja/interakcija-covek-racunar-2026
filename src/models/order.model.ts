import type { MovieModel } from "./movie.model"

export interface OrderModel {
    movieId: number
    movie?: MovieModel
    time: string
    seat: string
    createdAt: string
    paidAt?: string
}