import axios from "axios";
import { UserService } from "./user.service"

export class ChatService {
    static async handleUserInput(input: string) {
        if (input.includes('sam ja')) {
            if (UserService.getActiveUser()) {
                return `Ulogovani ste kao ${UserService.getActiveUser()?.email}`
            }
            return 'Niste ulogovani!'
        }

        const prompt = `
        Potrebno je da na osnovu zahteva korisnika a to je: ${input},
        zakljucis koji je od sledecih intent-ova hteo i da odgovor vratis u obliku JSONa
        {"intent":"about_user"}

        Ako mozes skloni Markdown formating za JSON
        Vec ga vrati kao plain text kako bih ga lakse ucitao kao objekat

        1) about_user - Detalji o korisniku
        2) recommend - Preporuci film
        3) nlu_fallback - Ako nisi siguran sta korisnik misli
        `

        const rsp = await axios.request({
            url: 'http://89.216.53.172:11434/api/generate',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                model: 'gemma4:e4b',
                prompt: prompt,
                stream: false
            },
            validateStatus: () => true
        })

        return rsp.data.response
    }
}