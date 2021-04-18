import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UserDocument = User & Document

@Schema()
export class User {
    @Prop()
    id: number

    @Prop()
    firstName: string

    @Prop()
    lastName: string

    @Prop()
    email: string

    @Prop()
    phone: string

    @Prop()
    password: string

    @Prop(
        raw({
            isOnline: Boolean,
            description: String,
            views: {
                current: Number,
                prev: Number,
            },

            connections: [{ userId: Number, date: Number, chatId: Number }],
            sentConnections: [{ userId: Number, message: String, chatId: Number }],
            receivedConnections: [{ userId: Number, message: String, chatId: Number }],
            posts: [{ postId: Number }],
            avatar: String,
            profileHeaderBg: String,
            dateOfBirth: Number,
            profession: String,
            locality: {
                country: String,
                city: String,
            },
        }),
    )
    info: Record<string, any>
}

export const UserSchema = SchemaFactory.createForClass(User)
