import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { ChatState } from '../store/chat/chat.reducer'
import { ReceiveMessageAction } from '../store/chat/chat.actions'
import { IMessage } from '../interfaces/chat/message'
import { WebSocketService } from './web-socket.service'

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    constructor(
        private socketService: WebSocketService,
        private store$: Store<ChatState>,
    ) {
        this.socketService
            .listen('connection')
            .subscribe(() => this.onConnection())
    }

    joinToChat(chatId: number): void {
        this.socketService.emit('joinPrivateChat', { chatId })
    }

    sendMessage(message: string): void {
        this.socketService.emit('sendMessage', { message })
    }

    onConnection(): void {
        console.log('Connected!')
        this.socketService
            .listen<{ msg: IMessage; senderId: number }>('receiveMsg')
            .subscribe(data => console.log('[WebSocket Message]', data.msg))

        this.socketService
            .listen<{ message: string }>('joinSuccess')
            .subscribe(data => console.log('[WebSocket Message]', data.message))

        // this.store$.dispatch(new ReceiveMessageAction({
        //     senderId: data.senderId,
        //     content: data.msg
        // }))
    }
}
