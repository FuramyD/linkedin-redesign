export interface IPost {
    creator: {
        id: number
        fullName: string
    }
    content: string
    dateOfLastModify?: Date
    dateOfCreation: Date

    likes: {
        userId: number
    }[]

    attached: {
        images?: string[]
        videos?: string[]
        files?: string[]
    }

    comments?: {
        content: string
    }[]
}
