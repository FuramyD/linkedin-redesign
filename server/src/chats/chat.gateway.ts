import { OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { IMessage } from '../interfaces/chat/message'

@WebSocketGateway()
export class ChatGateway {
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
    }

    @SubscribeMessage('sendMessage')
    receiveMessage(client: Socket, data: { message: IMessage; chatId: string }): WsResponse<{ message: IMessage; chatId: string }> {
        console.log('send')
        return { event: 'receiveMessage', data }
    }

    @SubscribeMessage('connecttt')
    connect(socket: Socket, data: any): void {
        console.log('hello', socket.id)
    }
}
