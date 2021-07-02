import { Injectable } from '@nestjs/common'
import { CreateUserDto } from '../dto/create-user.dto'
import { AuthDto } from '../dto/auth.dto'
import { IUser } from '../interfaces/user'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UserDocument } from './user.shema'
import { ChatDocument } from '../chats/chat.shema'
import { IPersonalInfo } from '../interfaces/edit-profile/personalInfo'
import { Express } from 'express'
import { IUniversity } from '../interfaces/university'
import { IExp } from '../interfaces/exp'
import { IProject } from '../interfaces/project'
import { IContact } from '../interfaces/contact'
import { ILocality } from '../interfaces/locality'

const URL = 'http://localhost:3000'

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
        if ((await this.userModel.findOne({ email: user.email }).exec()) || (await this.userModel.findOne({ phone: user.phone }).exec()))
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

    async validateUserBySomething(id: number, fieldName: string, value: string): Promise<UserDocument | null> {
        const user = await this.userModel.findOne({ id, [fieldName]: value })

        if (user) {
            console.log(user)
            return user
        }

        return null
    }
    async removeUser(id: number, password: string): Promise<boolean | null> {
        const user = await this.userModel.findOne({ id })
        if (user.password === password) {
            const deleted = await this.userModel.deleteOne({ id })
            const users = await this.userModel.find().exec()
            const identifiers = []
            users.forEach(user => {
                identifiers.push(user.id)
            })

            for (let i = 0; i < identifiers.length; i++) {
                let user = await this.userModel.findOne({ id: identifiers[i] })
                user.info.connections = user.info.connections.filter(user => user.userId !== id)
                await user.save()
            }

            if (deleted) return true
            return null
        }
        return false
    }

    async sendConnection(senderId: number, userId: number, message: string): Promise<{ sent: boolean }> {
        const user = await this.userModel.findOne({ id: userId })
        const sender = await this.userModel.findOne({ id: senderId })

        if (user && sender) {
            if (user.info.sentConnections.find(user => user.userId === sender.id)) {
                return
            }

            user.info.receivedConnections.push({
                userId: senderId,
                message: message,
            })

            sender.info.sentConnections.push({
                userId: userId,
                message: message,
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

        let chats = await this.chatModel.find()
        const chat = chats.find(chat => {
            return chat.users.find(u => u.userId === userId) && chat.users.find(u => u.userId === senderId)
        })

        if (chat) {
            await this.chatModel.deleteOne({ chatId: chat.chatId })
        }

        const chatId = chat?.chatId ?? (await this.chatModel.find().exec()).length

        const newChat = new this.chatModel({
            chatId,
            users: [{ userId: senderId }, { userId: userId }],
            messages: [],
            attached: [],
        })

        await newChat.save()

        if (user && sender) {
            if (!user.info.connections.find(user => user.userId === senderId))
                if (user.info.receivedConnections.find(user => user.userId === senderId)) {
                    // проверка на то что sender'a нет в connections
                    // если sender есть во входящих connections

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

        let chats = await this.chatModel.find()
        const chat = chats.find(chat => {
            return chat.users.find(u => u.userId === userId) && chat.users.find(u => u.userId === senderId)
        })

        if (chat) {
            await this.chatModel.deleteOne({ chatId: chat.chatId })
        }

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

    async findAllUsers(query?: { fullName?: string }): Promise<any> {
        let users = await this.userModel.find().exec()
        if (query?.fullName) {
            const [firstName, lastName] = query.fullName.split(' ').map(el => {
                if (el) return el.toLowerCase()
                return ''
            })
            users = users.filter(user => {
                if (firstName && lastName)
                    return (
                        user.firstName.toLowerCase().startsWith(firstName) && // === firstName
                        user.lastName.toLowerCase().startsWith(lastName)
                    )

                if (firstName) return user.firstName.toLowerCase().startsWith(firstName)

                return false
            })
        }
        return users
    }

    async clearConnections(id: number): Promise<any> {
        const user = await this.userModel.findOne({ id })
        user.info.connections = []
        await user.save()
    }

    async editPersonalInfo(id: number, info: IPersonalInfo): Promise<string> {
        const user = await this.userModel.findOne({ id })
        if (!user) return 'not found'
        user.firstName = info.firstName
        user.lastName = info.lastName
        user.info.dateOfBirth = info.dateOfBirth
        user.info.gender = info.gender

        await user.save()
        return 'changed'
    }

    async uploadAvatar(file: Express.Multer.File, userId: number): Promise<boolean> {
        const user = await this.userModel.findOne({ id: userId })
        if (!user) return false

        console.log(file)

        user.info.avatar = {
            fileName: file.originalname,
            encoding: file.encoding,
            mimetype: file.mimetype,
            url: `${URL}/uploads/${file.filename}`,
            size: file.size,
        }
        await user.save()

        return true
    }

    async deleteAvatar(userId: number): Promise<boolean> {
        const user = await this.userModel.findOne({ id: userId })
        if (!user) return false

        user.info.avatar = null
        await user.save()

        return true
    }

    async changeEmail(userId: number, email: string): Promise<boolean> {
        const user = await this.userModel.findOne({ id: userId })
        if (!user) return false

        user.email = email
        await user.save()
        return true
    }

    async changePhone(userId: number, phone: string): Promise<boolean> {
        const user = await this.userModel.findOne({ id: userId })
        if (!user) return false

        user.phone = phone
        await user.save()
        return true
    }

    async changePassword(userId: number, newPassword: string, oldPassword: string): Promise<boolean | null> {
        const user = await this.userModel.findOne({ id: userId, password: oldPassword })
        if (!user) return null

        if (newPassword === oldPassword) return false

        user.password = newPassword
        await user.save()
        return true
    }

    async changeRole(userId: number, role: string): Promise<boolean> {
        const user = await this.userModel.findOne({ id: userId })
        if (!user) return false

        user.info.role = role
        await user.save()

        return true
    }

    // async changeCompany(userId: number, company: string): Promise<boolean> {}

    async changeAbout(userId: number, about: string): Promise<boolean> {
        const user = await this.userModel.findOne({ id: userId })
        if (!user) return false

        user.info.about = about
        await user.save()

        return true
    }

    async changeProfession(userId: number, profession: string): Promise<boolean> {
        const user = await this.userModel.findOne({ id: userId })
        if (!user) return false

        user.info.profession = profession
        await user.save()

        return true
    }

    async changeLocality(userId: number, locality: ILocality): Promise<boolean> {
        const user = await this.userModel.findOne({ id: userId })
        if (!user) return false

        user.info.locality = locality
        await user.save()

        return true
    }

    async changeContactInfo(userId: number, contactInfo: IContact[]): Promise<boolean> {
        const user = await this.userModel.findOne({ id: userId })
        if (!user) return false

        user.info.contactInfo = contactInfo
        await user.save()

        return true
    }

    async changeProjects(userId: number, projects: IProject[]): Promise<boolean> {
        const user = await this.userModel.findOne({ id: userId })
        if (!user) return false

        user.info.projects = projects
        await user.save()

        return true
    }

    async changeExperience(userId: number, experience: IExp[]): Promise<boolean> {
        const user = await this.userModel.findOne({ id: userId })
        if (!user) return false

        user.info.experience = experience
        await user.save()

        return true
    }

    async changeEducation(userId: number, education: IUniversity[]): Promise<boolean> {
        const user = await this.userModel.findOne({ id: userId })
        if (!user) return false

        user.info.education = education
        await user.save()

        return true
    }
    async a(userId: number) {
        const user = await this.userModel.findOne({ id: userId })
        user.info.projects = []
        user.info.contactInfo = []
        await user.save()
    }
}
