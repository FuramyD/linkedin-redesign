import { ICreator } from './creator'

export interface IComment {
    id: number
    creator: ICreator
    content: string
    dateOfLastModify?: number
    dateOfCreation: number

    likes: {
        userId: number
    }[]
}
