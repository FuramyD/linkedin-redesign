import { IFile } from './file'
import { IContact } from './contact'
import { IProject } from './project'
import { IExp } from './exp'
import { IUniversity } from './university'

export interface IUser {
    id: number

    firstName: string
    lastName: string
    email: string
    phone: string
    password: string

    info: {
        isOnline: boolean
        role: string
        description: string
        about: string
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
        avatar: IFile | null
        profileHeaderBg: IFile | null
        dateOfBirth: number
        gender: string
        profession: string
        locality: {
            country: string
            city: string
        }
        contactInfo: IContact[]
        projects: IProject[]
        experience: IExp[]
        education: IUniversity[]
        dateOfLastPasswordUpdate: number
    }
}
