import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core'
import { ChatService } from '../../../services/chat.service'
import {Observable, Subject} from 'rxjs'
import { select, Store } from '@ngrx/store'
import { MyProfileState } from '../../../store/my-profile/my-profile.reducer'
import {map, take, takeUntil} from 'rxjs/operators'
import { Chat, ChatState } from '../../../store/chat/chat.reducer'
import {
    currentChatSelector,
    messagesSelector,
} from '../../../store/chat/chat.selectors'
import { IMessages } from '../../../interfaces/chat/messages'

@Component({
    selector: 'app-chat-main',
    templateUrl: './chat-main.component.html',
    styleUrls: ['./chat-main.component.less'],
})
export class ChatMainComponent implements OnInit, OnDestroy {
    constructor(
        private chatService: ChatService,
        private store$: Store<MyProfileState | ChatState>,
    ) {}

    unsub$ = new Subject()

    @Input() profileId: number = -1

    currentChatId: number = -1

    // allChats$: Observable<IChat[]> = this.store$.pipe(
    //     select(chatsSelector)
    // )

    @ViewChild('messages') messages: ElementRef | null = null

    currentChat$: Observable<Chat | null | undefined> = this.store$.pipe(
        select(currentChatSelector),
    )

    messages$: Observable<IMessages[] | never[] | undefined> = this.store$.pipe(
        select(messagesSelector),
    )

    buddy = {
        isOnline: false,
        lastOnline: Date.now() - 60 * 60 * 5,
    }

    Date = Date

    messageContent: string = ''

    sendMessage(): void {
        console.log('chatId:', this.currentChatId)
        console.log('profileID:', this.profileId)
        console.log('message:', this.messageContent)
        if (this.messageContent === '') return
        this.chatService.sendMessage(
            this.messageContent,
            this.profileId,
            this.currentChatId,
        )
        this.messageContent = ''
    }

    dateParser(now: number, last: number): string {
        const deltaSec = (now - last) / 1000
        const secondsPerDay = 60 * 60 * 24
        const secondsPerHour = 60 * 60
        const secondsPerMinute = 60

        if (deltaSec > secondsPerDay) {
            const days = Math.floor(deltaSec / secondsPerDay)
            if (days < 2) return 'day ago'
            return Math.floor(deltaSec / secondsPerDay) + ' days ago'
        } else if (deltaSec > secondsPerHour) {
            const hours = Math.floor(deltaSec / secondsPerDay)
            if (hours < 2) return 'hour ago'
            return Math.floor(deltaSec / secondsPerHour) + ' hours ago'
        } else if (deltaSec > secondsPerMinute) {
            const minutes = Math.floor(deltaSec / secondsPerDay)
            if (minutes < 2) return 'minute ago'
            return Math.floor(deltaSec / secondsPerMinute) + ' minutes ago'
        } else return 'minute ago'
    }

    ngOnInit(): void {
        this.currentChat$.pipe(takeUntil(this.unsub$)).subscribe(chat => {
            this.currentChatId = chat?.chat.chatId ?? -1
        })

        this.messages$.pipe(takeUntil(this.unsub$)).subscribe(() => {
            if (this.messages) {
                setTimeout(() => {
                    const { nativeElement: messages } = this.messages as {
                        nativeElement: HTMLElement
                    }
                    messages.scrollTop = messages.scrollHeight
                })
            }
        })
    }

    ngOnDestroy(): void {
        this.unsub$.next()
        this.unsub$.complete()
    }
}
