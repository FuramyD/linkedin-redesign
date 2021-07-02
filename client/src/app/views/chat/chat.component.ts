import { Component, OnDestroy, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { select, Store } from '@ngrx/store'
import { myProfileIdSelector } from '../../store/my-profile/my-profile.selectors'
import { ChatService } from '../../services/chat.service'
import { MyProfileState } from '../../store/my-profile/my-profile.reducer'
import { Chat, ChatState } from '../../store/chat/chat.reducer'
import {
    LoadChatsAction,
    ChangeCurrentChatAction,
} from '../../store/chat/chat.actions'
import { EntityState } from '@ngrx/entity'

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.less'],
})
export class ChatComponent implements OnInit, OnDestroy {
    constructor(
        private chatService: ChatService,
        private store$: Store<MyProfileState | ChatState | EntityState<Chat>>,
    ) {}

    profileId: number = -1
    activeChat: number = -1

    profileId$: Observable<number> = this.store$.pipe(
        select(myProfileIdSelector),
    )

    readInterval: number = -1

    sideActionsHandler(action: { type: string; data: any }): void {
        switch (action.type) {
            case 'changeActiveChat':
                if (this.activeChat === action.data) return
                this.activeChat = action.data

                this.store$.dispatch(
                    new ChangeCurrentChatAction({ id: action.data }),
                )
                this.store$.dispatch(
                    new LoadChatsAction({ profileId: this.profileId }),
                )

                // clearInterval(this.readInterval)
                this.chatService.readMessages(this.profileId, action.data)
                // this.readInterval = setInterval(this.chatService.readMessages, 1000, this.profileId, this.activeChat)

                this.chatService.connect()
                break
            default:
                break
        }
    }

    ngOnInit(): void {
        this.profileId$.subscribe(id => {
            this.profileId = id
        })

        setTimeout(() => {
            this.store$.dispatch(
                new LoadChatsAction({ profileId: this.profileId }),
            )
        }, 100)
    }

    ngOnDestroy(): void {}
}
