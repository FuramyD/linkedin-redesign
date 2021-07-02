import { Injectable } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { ChatState } from '../store/chat/chat.reducer'
import {
    ReadMessageAction,
    ReceiveMessageAction,
} from '../store/chat/chat.actions'
import { IMessage } from '../interfaces/chat/message'
import { WebSocketService } from './web-socket.service'
import { IUser } from '../interfaces/user'
import { Observable, of, Subject } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { IChat } from '../interfaces/chat/chat'
import { environment } from '../../environments/environment'
import { filter, map, switchMap, takeUntil } from 'rxjs/operators'
import { MyProfileState } from '../store/my-profile/my-profile.reducer'
import { myProfileIdSelector } from '../store/my-profile/my-profile.selectors'
import { IMessages } from '../interfaces/chat/messages'

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    constructor(
        private socketService: WebSocketService,
        private store$: Store<MyProfileState | ChatState>,
        private http: HttpClient,
    ) {}

    unsub$ = new Subject()

    profileId$: Observable<number> = this.store$.pipe(
        select(myProfileIdSelector),
    )

    joinToChat(chatId: number): void {
        this.socketService.emit('joinPrivateChat', { chatId })
    }

    sendMessage(message: string, senderId: number, chatId: number): void {
        this.socketService.emit<{ message: IMessage; chatId: number }>(
            'sendMessage',
            {
                message: {
                    senderId,
                    status: 'wait',
                    time: Date.now(),
                    content: message,
                },
                chatId,
            },
        )
    }

    connect(): void {
        this.unsub$.next()
        this.unsub$.complete()

        this.unsub$ = new Subject()

        this.http
            .get<{ chats: IChat[] }>(`${environment.server_url}/chats/find/all`)
            .pipe(
                map(res => res.chats),
                switchMap(chats => {
                    return this.profileId$.pipe(
                        map(id => {
                            return chats.filter(chat => {
                                return chat.users.find(u => u.userId === id)
                            })
                        }),
                        map(res => {
                            console.log(res)
                            return res
                        }),
                    )
                }),
            )
            .subscribe(myChats => {
                myChats.forEach(chat => {
                    this.joinToChat(chat.chatId)
                })
            })

        this.socketService
            .listen<{ messages: IMessages[]; chatId: number }>('receiveMessage')
            .pipe(takeUntil(this.unsub$))
            .subscribe(data => {
                console.log(
                    '[WebSocket Message]',
                    data.messages[data.messages.length - 1].dayMessages[
                        data.messages[data.messages.length - 1].dayMessages
                            .length - 1
                    ].content,
                )
                this.store$.dispatch(
                    new ReceiveMessageAction({
                        chatId: data.chatId,
                        messages: data.messages,
                    }),
                )
            })

        this.socketService
            .listen<{ messages: IMessages[]; chatId: number }>('readMessages')
            .pipe(takeUntil(this.unsub$))
            .subscribe(data => {
                this.store$.dispatch(
                    new ReadMessageAction({
                        chatId: data.chatId,
                        messages: data.messages,
                    }),
                )
            })

        this.socketService
            .listen<{ message: string }>('joinSuccess')
            .pipe(takeUntil(this.unsub$))
            .subscribe(data => console.log('[WebSocket Join]', data.message))
    }

    readMessages(profileId: number, chatId: number): void {
        this.socketService.emit('readMessages', { chatId, profileId })
    }

    getChats(): void {}

    getBuddyProfiles(chats: IChat[], profileId: number): Observable<IUser[]> {
        const myChats = chats.filter(chat => {
            return chat.users.some(user => user.userId === profileId)
        })
        console.log('chats', chats)
        const identifiers: number[] = []
        myChats.forEach(chat => {
            const buddy = chat.users.find(user => user.userId !== profileId)
            if (!buddy) return
            identifiers.push(buddy.userId)
        })
        const param = identifiers.join(',')
        console.log('PARAM:', param)
        if (!param) return of([])
        if (identifiers.length > 1) {
            return this.http
                .get<{ users: IUser[] }>(
                    `${environment.server_url}/users/find/${param}`,
                )
                .pipe(map(res => res.users))
        } else {
            return this.http
                .get<{ user: IUser }>(
                    `${environment.server_url}/users/find/${param}`,
                )
                .pipe(map(res => [res.user]))
        }
    }
}
