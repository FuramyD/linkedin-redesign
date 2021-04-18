import { IAttached } from '../interfaces/post/attached'

export interface PostDto {
    creator: {
        id: number
        fullName: string
        profession: string
        avatar: string | ArrayBuffer | null
    }
    content: string
    dateOfCreation: number

    attached: IAttached
}
