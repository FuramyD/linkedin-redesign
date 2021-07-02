import { OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { IMessage } from '../interfaces/chat/message'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ChatDocument } from './chat.shema'

@WebSocketGateway()
export class ChatGateway {
    constructor(@InjectModel('chats') private chatModel: Model<ChatDocument>) {}

    @WebSocketServer() wss: Server

    @SubscribeMessage('sendConnection')
    sendConnection(socket: Socket, data: any): void {
        console.log('[Send Connection]', '\ndata:', data)
        socket.join(data.chatId)
    }

    @SubscribeMessage('joinPrivateChat')
    joinPrivateChat(socket: Socket, data: any): void {
        socket.join(data.chatId)
        socket.to(data.chatId).emit('joinSuccess', { message: 'Success' })
        console.log('success join')
        console.log(socket.adapter.rooms)
    }

    @SubscribeMessage('sendMessage')
    async receiveMessage(socket: Socket, data: { message: IMessage; chatId: number | string }): Promise<void> {
        console.log(data)
        const chat = await this.chatModel.findOne({ chatId: +data.chatId })
        const date = new Date().toLocaleDateString()
        const dayMessages = chat.messages.find(m => m.day === date)

        data.message.status = 'sent'

        if (!dayMessages) {
            chat.messages.push({
                day: date,
                dayMessages: [data.message],
            })
        }

        if (dayMessages) {
            dayMessages.dayMessages.push(data.message)
        }

        await chat.save()

        socket.to(data.chatId.toString()).emit('receiveMessage', { messages: chat.messages, chatId: data.chatId })
        socket.emit('receiveMessage', { messages: chat.messages, chatId: data.chatId })
    }

    @SubscribeMessage('readMessages')
    async messagesRead(socket: Socket, data: { chatId: number | string; profileId: number | string }): Promise<void> {
        const chat = await this.chatModel.findOne({ chatId: +data.chatId })
        if (!chat) return

        chat.messages.forEach(m => {
            m.dayMessages.forEach(message => {
                if (message.status !== 'read' && message.senderId !== data.profileId) message.status = 'read'
            })
        })

        chat.save()
        socket.to(data.chatId.toString()).emit('messagesRead', { chat })
        socket.emit('messagesRead', { chat })
    }
}
