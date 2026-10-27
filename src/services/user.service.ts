const USERS_KEY = 'icr_2026_users'
const ACITVE_KEY = 'icr_2026_active'

export class UserService {
    static getUsers() {
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

    static login(email: string, password: string) {
        const users = this.getUsers()

        for (let user of users) {
            if (user.email == email && user.password == password) {
                localStorage.setItem(ACITVE_KEY, email)
                return true
            }
        }

        return false
    }

    static getActiveUser() {
        const users = this.getUsers()

        for (let user of users) {
            if (localStorage.getItem(ACITVE_KEY) == user.email) {
                return user
            }
        }

        return null
    }

    static logout() {
        localStorage.removeItem(ACITVE_KEY)
    }
}