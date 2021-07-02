import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ChatDocument } from './chat.shema'

@Injectable()
export class ChatsService {
    constructor(@InjectModel('chats') private chatModel: Model<ChatDocument>) {}

    async getChats() {
        return this.chatModel.find().exec()
    }

    async getChat(id: number) {
        return this.chatModel.find({ chatId: id }).exec()
    }

    async deleteOne(id: number) {
        await this.chatModel.deleteOne({ chatId: id }).exec()
    }

    async deleteAll() {
        await this.chatModel.deleteMany().exec()
    }
}
