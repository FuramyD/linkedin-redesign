import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { strict } from 'assert'
import { IContact } from '../interfaces/contact'
import { IProject } from '../interfaces/project'
import { IExp } from '../interfaces/exp'
import { IUniversity } from '../interfaces/university'

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
            role: String,
            description: String,
            about: String,
            views: {
                current: Number,
                prev: Number,
            },

            connections: [{ userId: Number, date: Number, chatId: Number }],
            sentConnections: [{ userId: Number, message: String, chatId: Number }],
            receivedConnections: [{ userId: Number, message: String, chatId: Number }],
            posts: [{ postId: Number }],
            avatar: { fileName: String, encoding: String, mimetype: String, url: String, size: Number },
            profileHeaderBg: String,
            dateOfBirth: Number,
            profession: String,
            gender: String,
            locality: {
                country: String,
                city: String,
            },
            contactInfo: [{ contactWay: String, data: String }],
            projects: [
                {
                    name: String,
                    role: String,
                    date: String,
                    about: String,
                    poster: { fileName: String, encoding: String, mimetype: String, url: String, size: Number },
                },
            ],
            experience: [
                {
                    companyName: String,
                    profession: String,
                    start: String,
                    end: String,
                    logo: { fileName: String, encoding: String, mimetype: String, url: String, size: Number },
                },
            ],
            education: [
                {
                    name: String,
                    facultyAndDegree: String,
                    comment: String,
                    start: String,
                    end: String,
                    logo: { fileName: String, encoding: String, mimetype: String, url: String, size: Number },
                },
            ],
            dateOfLastPasswordUpdate: Number,
        }),
    )
    info: Record<string, any>
}

export const UserSchema = SchemaFactory.createForClass(User)
