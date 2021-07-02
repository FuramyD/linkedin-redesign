import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core'
import { IChat } from '../../../interfaces/chat/chat'
import { IUser } from '../../../interfaces/user'
import {Observable, Subject} from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { ChatService } from '../../../services/chat.service'
import { select, Store } from '@ngrx/store'
import { MyProfileState } from '../../../store/my-profile/my-profile.reducer'
import { Chat, ChatState } from '../../../store/chat/chat.reducer'
import {
    allChatsSelector,
    currentChatSelector,
} from '../../../store/chat/chat.selectors'

@Component({
    selector: 'app-chat-side',
    templateUrl: './chat-side.component.html',
    styleUrls: ['./chat-side.component.less'],
})
export class ChatSideComponent implements OnInit {
    constructor(
        private chatService: ChatService,
        private store$: Store<MyProfileState | ChatState>,
    ) {}



    @Input() profileId: number = -1

    @Output() action = new EventEmitter<{ type: string; data: any }>()

    allChats$: Observable<Chat[]> = this.store$.pipe(select(allChatsSelector))

    currentChat$: Observable<Chat | null | undefined> = this.store$.pipe(
        select(currentChatSelector),
    )

    unread = []

    activateChat(chatId: number | string): void {
        this.action.emit({ type: 'changeActiveChat', data: chatId })
    }

    ngOnInit(): void {}
}
