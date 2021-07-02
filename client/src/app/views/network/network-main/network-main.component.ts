import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { MyProfileState } from '../../../store/my-profile/my-profile.reducer'
import { Observable, of, Subscription } from 'rxjs'
import {
    myProfileConnectionsSelector,
    myProfileIdSelector,
    myProfileReceivedConnectionsSelector,
    myProfileSentConnectionsSelector,
} from '../../../store/my-profile/my-profile.selectors'
import { ProfileService } from '../../../services/profile.service'
import { IUser } from '../../../interfaces/user'
import { ProfileState } from '../../../store/profile/profile.reducer'
import {
    MyProfileGetInfoAction,
    MyProfileRemoveConnectionAction,
} from '../../../store/my-profile/my-profile.actions'
import { filter, map, switchMap } from 'rxjs/operators'
import {
    ProfileAcceptConnectionAction,
    ProfileDeclineConnectionAction,
    ProfileSendConnectionAction,
} from '../../../store/profile/profile.actions'

@Component({
    selector: 'app-network-main',
    templateUrl: './network-main.component.html',
    styleUrls: ['./network-main.component.less'],
})
export class NetworkMainComponent implements OnInit, OnDestroy {
    constructor(
        private store$: Store<MyProfileState | ProfileState>,
        private profileService: ProfileService,
    ) {}

    private subs: Subscription[] = []
    private set sub(s: Subscription) {
        this.subs.push(s)
    }

    myConnections: { user: IUser; date: number }[] = []
    myProfileId: number = -1

    @Input() activeTab: string = ''

    myConnections$: Observable<
        { user: IUser; date: number }[]
    > = this.store$.pipe(
        select(myProfileConnectionsSelector),
        switchMap(connections => {
            return this.profileService.getConnectionsById$(connections)
        }),
    )

    sendConnection(userId: number, message: string): void {
        console.log('[SEND] user id:', userId, 'message:', message)
        this.store$.dispatch(
            new ProfileSendConnectionAction({
                senderId: this.myProfileId,
                userId,
                message,
            }),
        )
    }

    acceptConnection(userId: number): void {
        console.log('[ACCEPT] user id:', userId)
        this.store$.dispatch(
            new ProfileAcceptConnectionAction({
                senderId: userId,
                userId: this.myProfileId,
                date: Date.now(),
            }),
        )
    }

    declineConnection(userId: number): void {
        console.log('[DECLINE] user id:', userId)
        this.store$.dispatch(
            new ProfileDeclineConnectionAction({
                senderId: userId,
                userId: this.myProfileId,
            }),
        )
    }

    cancelConnection(userId: number): void {
        console.log('[CANCEL] user id:', userId)
        this.store$.dispatch(
            new ProfileDeclineConnectionAction({
                senderId: this.myProfileId,
                userId,
            }),
        )
    }

    removeConnection(userId: number): void {
        console.log('[REMOVE] user id:', userId)
        this.store$.dispatch(
            new MyProfileRemoveConnectionAction({
                senderId: this.myProfileId,
                userId,
            }),
        )
    }

    connectionsActionHandler(data: {
        action: string
        userId: number
        message?: string
    }): void {
        const { action, ...d } = data
        const { userId, message = '' } = d
        switch (action) {
            case 'send':
                this.sendConnection(userId, message)
                return
            case 'accept':
                this.acceptConnection(userId)
                return
            case 'decline':
                this.declineConnection(userId)
                return
            case 'cancel':
                this.cancelConnection(userId)
                return
            case 'remove':
                this.removeConnection(userId)
                return
        }
    }

    ngOnInit(): void {
        this.sub = this.store$
            .pipe(select(myProfileIdSelector))
            .subscribe(id => {
                if (id >= 0) this.myProfileId = id
                else
                    this.myProfileId = JSON.parse(
                        localStorage.getItem('currentUser') as string,
                    ).user.id
            }) // get this.myProfileId

        this.store$.dispatch(
            new MyProfileGetInfoAction({ id: this.myProfileId }),
        ) // get info

        this.sub = this.myConnections$.subscribe(
            connections => (this.myConnections = connections),
        )
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe())
    }
}
