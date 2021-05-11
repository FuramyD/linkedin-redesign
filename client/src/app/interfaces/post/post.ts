import { IComment } from './comment'
import { IAttached } from './attached'
import { ICreator } from './creator'

export interface IPost {
    id: number

    creator: ICreator
    content: string
    dateOfLastModify?: number
    dateOfCreation: number

    likes: {
        userId: number
    }[]

    attached: IAttached

    comments?: IComment[]
    commentsOpen?: boolean
}
