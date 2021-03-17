export interface IUser {
    id: number

    firstName: string
    lastName: string
    email: string
    phone: string
    password: string

    info: {
        isOnline: boolean
        views: {
            current: number
            prev: number
        }
        posts: number[] // array of posts id
    }
}
