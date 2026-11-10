import type { MovieModel } from "@/models/movie.model";
import type { SimpleModel } from "@/models/simple.model";
import axios from "axios";

const client = axios.create({
    baseURL: 'https://movie.pequla.com/api'
})


export class MovieService {
    static async getMovies() {
        const rsp = await client.get<SimpleModel[]>('/movie/simple')
        return rsp.data.sort((m1, m2) => m2.movieId - m1.movieId)
    }

    static async getDetails(permalink: string) {
        return await client.get<MovieModel>(`/movie/short/${permalink}`)
    }

    static async getMoviesByGenreId(id: number) {
        const rsp = await client.request<MovieModel[]>({
            method: 'GET',
            url: '/movie',
            params: {
                genre: id
            }
        })

        return rsp.data.sort((m1, m2) => m2.movieId - m1.movieId).slice(0, 4)
    }

    static async getGenreById(id: number) {
        return await client.get(`/genre/${id}`)
    }

    static async getMoviesByIds(ids: number[]) {
        return await client.request<MovieModel[]>({
            url: '/movie/list',
            method: 'POST',
            data: ids
        })
    }
}