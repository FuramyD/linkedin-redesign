import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { IAttach } from '../interfaces/post/attach'

export type ChatDocument = Chat & Document

@Schema()
export class Chat {
    @Prop()
    chatId: number

    @Prop({ type: [{ userId: Number }] })
    users: { userId: number }[]

    @Prop(
        raw([
            {
                day: String,
                dayMessages: [
                    {
                        id: Number,
                        senderId: Number,
                        content: String,
                        time: Number,
                        status: String,
                        attached: [
                            {
                                name: String,
                                type: String,
                                size: Number,
                                result: String,
                            },
                        ],
                    },
                ],
            },
        ]),
    )
    messages: Record<string, any>

    @Prop(
        raw([
            {
                name: String,
                type: String,
                size: Number,
                result: String,
            },
        ]),
    )
    attached: Record<string, any>
}

// @ts-ignore
export const ChatSchema = SchemaFactory.createForClass(Chat)
// @ts-ignore
