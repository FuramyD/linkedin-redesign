import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ChatDocument } from './chat.shema'

@Injectable()
export class ChatsService {
    constructor(@InjectModel('chats') private chatModel: Model<ChatDocument>) {}
}
