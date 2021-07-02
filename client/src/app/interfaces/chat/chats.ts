import { IMessage } from './message'

export interface IChats {
    chats: {
        chatId: number
        users: { userId: number }[]
        messages: IMessage[]
    }[]
}
