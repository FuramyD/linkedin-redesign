import { Injectable } from '@nestjs/common'
import { CreateUserDto } from '../dto/create-user.dto'
import { AuthDto } from '../dto/auth.dto'
import { IUser } from '../interfaces/user'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UserDocument } from './user.shema'
import { ChatDocument } from '../chats/chat.shema'

@Injectable()
export class UsersService {
    nextId: number = 0
    constructor(
        @InjectModel('users') private userModel: Model<UserDocument>,
        @InjectModel('chats') private chatModel: Model<ChatDocument>,
    ) {
        this.userModel
            .find()
            .exec()
            .then(res => (this.nextId = res.length))
    }

    async createUser(user: CreateUserDto | IUser): Promise<CreateUserDto | null> {
        if ((await this.userModel.find({ email: user.email }).exec())[0] || (await this.userModel.find({ phone: user.phone }).exec())[0])
            return null

        const USER = new this.userModel({
            id: this.nextId++,
            ...user,
            info: {
                views: {
                    current: 0,
                    prev: 0,
                },

                posts: [],

                connections: [],
                sentConnections: [],
                receivedConnections: [],

                avatar: null,
                profileHeaderBg: null,
                dateOfBirth: 0,
                profession: '',
                locality: {
                    country: '',
                    city: '',
                },

                chats: [],
            },
        })
        return USER.save()
    }

    async authUser(authData: AuthDto): Promise<UserDocument | null> {
        console.log(555)
        const user = await this.userModel.findOne({ email: authData.email, password: authData.password })
        if (user) {
            user.info.isOnline = true
            return user
        }
        return null
    }

    async findUserById(id: number): Promise<UserDocument | null> {
        console.log('ID =>>', id)
        const user = await this.userModel.findOne({ id: id })
        if (user) return user
        return null
    }

    async findUsersById(id: string): Promise<UserDocument[] | null> {
        let match = id.match(/(\d+,)+\d+$/)
        if (match) {
            const identifiers = match[0].split(',')
            const users = await this.userModel.find()
            return users.filter(user => identifiers.includes(`${user.id}`))
        }
        return null
    }

    async removeUser(id: number): Promise<boolean | null> {
        const user = await this.userModel.deleteOne({ id })
        if (user) return true
        return null
    }

    async sendConnection(senderId: number, userId: number, message: string): Promise<{ sent: boolean }> {
        const user = await this.userModel.findOne({ id: userId })
        const sender = await this.userModel.findOne({ id: senderId })

        if (user && sender) {
            if (user.info.sentConnections.find(user => user.userId === sender.id)) {
                return
            }
            const chatId = (await this.chatModel.find().exec()).length

            const chat = new this.chatModel({
                chatId,
                users: [{ userId: senderId }, { userId: userId }],
                messages: [],
                attached: [],
            })

            await chat.save()

            user.info.receivedConnections.push({
                userId: senderId,
                message: message,
                chatId,
            })

            sender.info.sentConnections.push({
                userId: userId,
                message: message,
                chatId,
            })

            // await this.userModel.updateOne({id: userId}, {
            //     $push: {
            //         'info.receivedConnections': {
            //             userId: senderId,
            //             message: message
            //         }
            //     }
            // })
            // await this.userModel.updateOne({id: senderId}, {
            //     $push: {
            //         'info.sentConnections': {
            //             userId: userId,
            //             message: message
            //         }
            //     }
            // })
            await user.save()
            await sender.save()
            return { sent: true }
        }
        return { sent: false }
    }

    async acceptConnection(senderId: number, userId: number, date: number): Promise<{ user: UserDocument; chatId: number } | null> {
        const user = await this.userModel.findOne({ id: userId })
        const sender = await this.userModel.findOne({ id: senderId })

        if (user && sender) {
            if (!user.info.connections.find(user => user.userId === senderId))
                if (user.info.receivedConnections.find(user => user.userId === senderId)) {
                    // проверка на то что sender'a уже нет в connections
                    // если sender есть во входящих connections

                    const chatId = user.info.receivedConnections.find(user => user.userId === senderId)?.chatId
                    console.log(chatId)
                    if (!chatId && chatId !== 0) return null

                    user.info.receivedConnections = user.info.receivedConnections.filter(user => user.userId !== senderId)
                    user.info.connections.push({ userId: senderId, date: date, chatId })

                    sender.info.sentConnections = user.info.sentConnections.filter(user => user.userId !== userId)
                    sender.info.connections.push({ userId: userId, date: date, chatId })

                    // await this.userModel.updateOne(
                    //     { id: userId },
                    //     {
                    //         $pullAll: { 'info.receivedConnections': [{ userId: senderId }] },
                    //         $push: { 'info.connections': { userId: senderId, date: date } }
                    //     }
                    // )
                    //
                    // await this.userModel.updateOne(
                    //     {id: senderId},
                    //     {
                    //         $pullAll: { 'info.receivedConnections': [{ userId: userId }] },
                    //         $push: { 'info.connections': { userId: userId, date: date } }
                    //     }
                    // )

                    await user.save()
                    await sender.save()

                    return { user, chatId } // возвращаем нового user'a
                }
        }
        return null // иначе возвращаем null
    }

    async declineConnection(senderId: number, userId: number): Promise<UserDocument | null> {
        const user = await this.userModel.findOne({ id: userId })
        const sender = await this.userModel.findOne({ id: senderId })

        if (user && sender) {
            if (user.info.receivedConnections.find(user => user.userId === senderId)) {
                // если sender есть во входящих connections
                user.info.receivedConnections = user.info.receivedConnections.filter(user => user.userId !== senderId) // тогда удаляем его от туда
                sender.info.sentConnections = user.info.sentConnections.filter(user => user.userId !== userId) // тоже самое делаем и с sender'ом

                await user.save()
                await sender.save()
                return user
            }
        }
        return null
    }

    async removeConnection(senderId: number, userId: number): Promise<UserDocument | null> {
        const user = await this.userModel.findOne({ id: userId })
        const sender = await this.userModel.findOne({ id: senderId })

        if (user && sender) {
            if (
                sender.info.connections.find(user => user.userId === userId) &&
                user.info.connections.find(user => user.userId === senderId)
            ) {
                sender.info.connections = sender.info.connections.filter(user => user.userId !== userId)
                user.info.connections = user.info.connections.filter(user => user.userId !== senderId)

                await user.save()
                await sender.save()
            }
            return user
        }

        return null
    }

    async findAllUsers(): Promise<any> {
        return await this.userModel.find().exec()
    }

    async clearConnections(id: number): Promise<any> {
        const user = await this.userModel.findOne({ id })
        user.info.connections = []
        await user.save()
    }
}
