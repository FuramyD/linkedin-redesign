import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { MyProfileState } from '../../../store/my-profile/my-profile.reducer'
import { ProfileState } from '../../../store/profile/profile.reducer'
import { ProfileService } from '../../../services/profile.service'
import { Observable, of, Subscription } from 'rxjs'
import {
    myProfileConnectionsSelector,
    myProfileReceivedConnectionsSelector,
    myProfileSentConnectionsSelector,
} from '../../../store/my-profile/my-profile.selectors'
import { IUser } from '../../../interfaces/user'
import { filter, map, switchMap } from 'rxjs/operators'
import {
    MyProfileAcceptConnectionAction,
    MyProfileCancelConnectionAction,
    MyProfileDeclineConnectionAction,
} from '../../../store/my-profile/my-profile.actions'
import { ChatService } from '../../../services/chat.service'

@Component({
    selector: 'app-invitations',
    templateUrl: './invitations.component.html',
    styleUrls: ['./invitations.component.less'],
})
export class InvitationsComponent implements OnInit, OnDestroy {
    constructor(
        private store$: Store<MyProfileState | ProfileState>,
        private profileService: ProfileService,
        private chatService: ChatService,
    ) {}

    private subs: Subscription[] = []
    private set sub(s: Subscription) {
        this.subs.push(s)
    }

    @Input() myProfileId: number = -1

    @Input() myConnections$: Observable<
        { user: IUser; date: number }[]
    > = new Observable()

    currentTab: string = 'received'

    receivedConnections$: Observable<
        { userId: number; message: string }[]
    > = this.store$.pipe(select(myProfileReceivedConnectionsSelector))

    sentConnections$: Observable<
        { user: IUser; message: string }[]
    > = this.store$.pipe(
        select(myProfileSentConnectionsSelector),
        map(connections => {
            const identifiers: number[] = []
            connections.forEach(el => identifiers.push(el.userId))
            return { identifiers, connections }
        }),
        switchMap(({ identifiers, connections }) => {
            if (identifiers.length > 1)
                return this.profileService
                    .getProfileInfo<{ users: IUser[] }>(identifiers.join(','))
                    .pipe(
                        map(res => res.users),
                        map(users => {
                            return users.map(user => ({
                                user,
                                message: (connections.find(
                                    connection => connection.userId === user.id,
                                ) as { userId: number; message: string })
                                    .message,
                            }))
                        }),
                    )
            if (identifiers.length === 1)
                return this.profileService
                    .getProfileInfo<{ user: IUser }>(identifiers[0])
                    .pipe(
                        map(res => res.user),
                        map(user => {
                            return [
                                {
                                    user,
                                    message: (connections.find(
                                        connection =>
                                            connection.userId === user.id,
                                    ) as {
                                        userId: number
                                        message: string
                                    }).message,
                                },
                            ]
                        }),
                    )
            else return of([])
        }),
    )

    newConnections: { user: IUser; message: string }[] = []
    sentConnections: { user: IUser; message: string }[] = []
    recentConnections: { user: IUser; date: number }[] = []

    acceptConnection(senderId: number): void {
        this.store$.dispatch(
            new MyProfileAcceptConnectionAction({
                senderId,
                userId: this.myProfileId,
                date: Date.now(),
            }),
        )
    }
    declineConnection(senderId: number): void {
        this.store$.dispatch(
            new MyProfileDeclineConnectionAction({
                senderId,
                userId: this.myProfileId,
            }),
        )
    }

    cancelConnection(userId: number): void {
        this.store$.dispatch(
            new MyProfileCancelConnectionAction({
                senderId: this.myProfileId,
                userId,
            }),
        )
    }

    action(data: { type: string; id: number }): void {
        if (data.type === 'accept') {
            this.acceptConnection(data.id)
        }

        if (data.type === 'decline') {
            this.declineConnection(data.id)
        }

        if (data.type === 'cancel') {
            this.cancelConnection(data.id)
        }
    }

    activateTab(e: MouseEvent): void {
        const element = e.target as HTMLElement
        const parent = element.parentNode as HTMLElement
        const children = Array.from(parent.children)

        children.forEach(el => el.classList.remove('active'))

        element.classList.add('active')
        this.currentTab = (element.textContent as string).toLowerCase()
    }

    ngOnInit(): void {
        this.sub = this.receivedConnections$.subscribe(connections => {
            if (!connections.length) {
                this.newConnections = []
                return
            }

            const usersId = connections.map(connection => connection.userId)
            if (usersId.length > 1) {
                this.sub = this.profileService
                    .getProfileInfo<{ users: IUser[] }>(usersId.join(','))
                    .subscribe(res => {
                        const users = res.users
                        this.newConnections = connections.map(connection => {
                            return {
                                user: users.find(
                                    user => user.id === connection.userId,
                                ) as IUser,
                                message: connection.message,
                            }
                        })
                    })
            } else if (usersId.length === 1) {
                this.sub = this.profileService
                    .getProfileInfo<{ user: IUser }>(usersId.join(','))
                    .subscribe(res => {
                        const user = res.user
                        this.newConnections = connections.map(connection => {
                            return {
                                user,
                                message: connection.message,
                            }
                        })
                    })
            }
        })

        this.sub = this.myConnections$
            .pipe(
                map(connections => {
                    console.log('map connections', connections)
                    return connections.reverse()
                }),
                filter((val, index) => index < 4),
            )
            .subscribe(connections => {
                this.recentConnections = connections
                console.log('recent connections', connections)
            })

        this.sub = this.sentConnections$.subscribe(sent => {
            this.sentConnections = sent
        })
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe())
    }
}
