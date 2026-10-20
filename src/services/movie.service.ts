import axios from "axios";

const client = axios.create({
    baseURL: 'https://movie.pequla.com/api/movie'
})


export class MovieService {
    static async getDetails(permalink: string) {
        return await client.get(`/short/${permalink}`)
    }
}