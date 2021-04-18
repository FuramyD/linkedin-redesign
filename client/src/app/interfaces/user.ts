export interface IUser {
    id: number

    firstName: string
    lastName: string
    email: string
    phone: string
    password: string

    info: {
        isOnline: boolean
        description: string
        views: {
            current: number
            prev: number
        }
        connections: { userId: number; date: number; chatId: number }[]
        sentConnections: { userId: number; message: string; chatId: number }[]
        receivedConnections: {
            userId: number
            message: string
            chatId: number
        }[]
        posts: {
            postId: number
        }[]
        avatar: string | ArrayBuffer | null
        profileHeaderBg: string | ArrayBuffer | null
        dateOfBirth: number
        profession: string
        locality: {
            country: string
            city: string
        }
    }
}
