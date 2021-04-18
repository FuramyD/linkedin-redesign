import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose'

export type PostDocument = Post & Document

const Attach = { type: { name: String, type: String, size: Number, result: String }, required: false }
const Comment = {
    id: Number,
    creator: {
        id: Number,
        fullName: String,
        profession: String,
        avatar: String,
    },
    content: String,
    dateOfLastModify: { type: Number, required: false },
    dateOfCreation: Number,

    likes: [{ userId: Number }],
}

@Schema()
export class Post {
    @Prop()
    id: number

    @Prop(
        raw({
            id: Number,
            fullName: String,
            profession: String,
            avatar: String,
        }),
    )
    creator: Record<string, any>

    @Prop()
    content: string

    @Prop({ required: false })
    dateOfLastModify: number

    @Prop()
    dateOfCreation: number

    @Prop()
    likes: {
        userId: number
    }[]

    @Prop(
        raw({
            files: [Attach],
            images: [Attach],
            videos: [Attach],
        }),
    )
    attached: Record<string, any>

    @Prop(raw(Comment))
    comments: [Record<string, any>]
}

export const PostSchema = SchemaFactory.createForClass(Post)
