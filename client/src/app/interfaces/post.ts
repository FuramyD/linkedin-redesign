export interface IPost {
    creator: {
        name
    }
    content: string
    dateOfLastModify?: Date
    dateOfCreation: Date

    attached: {
        images?: string[]
        videos?: string[]
        files?: string[]
    }

    comments?: {
        content
    }
}
