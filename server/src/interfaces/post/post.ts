import { IAttached } from './attached'
import { ICreator } from './creator'
import { IComment } from './comment'

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
}
