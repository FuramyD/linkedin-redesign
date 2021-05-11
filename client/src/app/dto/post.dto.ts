import { IAttached } from '../interfaces/post/attached'
import { ICreator } from '../interfaces/post/creator'

export interface PostDto {
    creator: ICreator
    content: string
    dateOfCreation: number

    attached: IAttached
}
