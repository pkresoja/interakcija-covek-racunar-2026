import axios from "axios";
import { UserService } from "./user.service"
import { MovieService } from "./movie.service";
import type { OllamaModel } from "@/models/ollama.model";

export class ChatService {
    static async handleUserInput(input: string) {
        // if (input.includes('sam ja')) {
        //     if (UserService.getActiveUser()) {
        //         return `Ulogovani ste kao ${UserService.getActiveUser()?.email}`
        //     }
        //     return 'Niste ulogovani!'
        // }

        const prompt = `
        Potrebno je da na osnovu zahteva korisnika a to je: ${input},
        zakljucis koji je od sledecih intent-ova hteo i da odgovor vratis u obliku JSONa
        {"intent":"about_user"}. Ako ima i podataka o filmu {"intent":"about_user","id":"1"}

        Ako mozes skloni Markdown formating za JSON odgovor
        Vec ga vrati kao plain text kako bih ga lakse ucitao kao objekat
        1) about_user - Detalji o korisniku
        2) recommend - Preporuci film, ako nema detaljnog zahteva vrati najnoviji, obavezno mora da ima polje id u JSONu
        3) add_to_cart - Dodaj u korpu, ako nema kog filma vrati intent add_to_cart_fail a ako ima onda vrati njegvo id takodje
        4) nlu_fallback - Ako nisi siguran sta korisnik misli

        Filmovi: ${await this.getMoviesFromCache()}
        `

        const rsp = await axios.request({
            url: 'http://89.216.53.172:11434/api/generate',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                model: 'gemma4:e4b',
                prompt: prompt.trim(),
                stream: false
            },
            validateStatus: () => true
        })

        const reply: OllamaModel = JSON.parse(rsp.data.response)
        if (reply.intent == 'nlu_fallback') {
            return 'Nisam najbolje razumeo. Pokušajte ponovo!'
        }

        if (reply.intent == 'about_user') {
            if (!UserService.getActiveUser())
                return 'Niste ulogovani'

            return `<div class="card">
            <div class="card-header fw-bold">Informacije o korisniku</div>
            <div class="card-body">
            ${UserService.getActiveUser()?.email}
            </div>
            </div>`
        }

        if (reply.intent == 'recommend') {
            const movie = await MovieService.getMovieById(reply.id!)

            return `
            <div class="card">
                <img src="${movie.data.poster}" class="card-img-top" alt="${movie.data.title}">
                <div class="card-body">
                    <p class="card-text">${movie.data.title}</p>
                </div>
            </div>`
        }

        if (reply.intent == 'add_to_cart') {
            const movie = await MovieService.getMovieById(reply.id!)
            window.location.href = `/movie/${movie.data.shortUrl}/order`
            return 'Odvedeni ste na stranicu!'
        }

        if (reply.intent == 'add_to_cart_fail') {
            return 'Morate navesti koji film zelite da dodate u korpu'
        }
    }

    private static async getMoviesFromCache() {
        if (!sessionStorage.getItem('icr_2026_movies')) {
            const movies = await MovieService.getMovies()
            sessionStorage.setItem('icr_2026_movies', JSON.stringify(
                movies.slice(0, 10).map(m => {
                    return {
                        id: m.movieId,
                        title: m.title,
                        desc: m.shortDescription
                    }
                })
            ))
        }

        return sessionStorage.getItem('icr_2026_movies')
    }
}