import { IComment } from './comment'
import { IAttached } from './attached'

export interface IPost {
    id: number

    creator: {
        id: number
        fullName: string
        profession: string
        avatar: string | ArrayBuffer | null
    }
    content: string
    dateOfLastModify?: number
    dateOfCreation: number

    likes: {
        userId: number
    }[]

    attached: IAttached

    comments?: IComment[]
}
