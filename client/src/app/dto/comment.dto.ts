export interface CommentDto {
    creator: {
        id: number
        fullName: string
        profession: string
        avatar: string | ArrayBuffer | null
    }
    content: string
    dateOfLastModify?: number
    dateOfCreation: number
}
