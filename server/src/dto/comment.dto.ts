import { ICreator } from '../interfaces/post/creator'

export interface CommentDto {
    creator: ICreator
    content: string
    dateOfLastModify?: number
    dateOfCreation: number
}
