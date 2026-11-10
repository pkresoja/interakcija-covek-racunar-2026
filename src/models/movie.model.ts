import type { GenreModel } from "./genre.model"

export interface MovieModel {
    movieId: number
    title: string
    originalTitle: string
    description: string
    shortDescription: string
    poster: string
    startDate: string
    runTime: number
    shortUrl: string
    active: boolean
    director: {
        directorId: number
        name: string
    }
    movieActors: {
        movieActorId: number
        actor: {
            actorId: number
            name: string
        }
    }[]
    movieGenres: {
        movieGenreId: number
        genre: GenreModel
    }[]
}