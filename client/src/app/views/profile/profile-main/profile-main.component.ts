import { Component, Input, OnInit } from '@angular/core'
import { ProfileState } from '../../../store/profile/profile.reducer'
import { initialProfileState } from '../profile.component'
import { Observable } from 'rxjs'
import { select, Store } from '@ngrx/store'
import {
    profileAvatarSelector,
    profileConnectionsSelector,
    profileDescriptionSelector,
    profileHeaderBgSelector,
    profileLocalitySelector,
    profileNameSelector,
    profileProfessionSelector,
    profileSelector,
    profileSentConnectionsSelector,
} from '../../../store/profile/profile.selectors'
import { IUser } from '../../../interfaces/user'
import { filter, map } from 'rxjs/operators'
import { MyProfileState } from '../../../store/my-profile/my-profile.reducer'
import {
    myProfileReceivedConnectionsSelector,
    myProfileSelector,
} from '../../../store/my-profile/my-profile.selectors'

// @ts-ignore
import { HystModal } from '../../../plugins/hystModal_.js'
import {
    ProfileAcceptConnectionAction,
    ProfileDeclineConnectionAction,
    ProfileRemoveConnectionAction,
    ProfileSendConnectionAction,
} from '../../../store/profile/profile.actions'

@Component({
    selector: 'app-profile-main',
    templateUrl: './profile-main.component.html',
    styleUrls: ['./profile-main.component.less', '../profile.component.less'],
})
export class ProfileMainComponent implements OnInit {
    constructor(private store$: Store<ProfileState | MyProfileState>) {}

    @Input() isMyProfile: boolean = false

    currentTab = 'profile'

    headerBg$: Observable<string | ArrayBuffer | null> = this.store$.pipe(
        select(profileHeaderBgSelector),
    )
    avatar$: Observable<string | ArrayBuffer | null> = this.store$.pipe(
        select(profileAvatarSelector),
    )
    fullName$: Observable<string> = this.store$.pipe(
        select(profileNameSelector),
    )
    description$: Observable<string> = this.store$.pipe(
        select(profileDescriptionSelector),
    )
    profession$: Observable<string> = this.store$.pipe(
        select(profileProfessionSelector),
    )
    connections$: Observable<{ userId: number }[]> = this.store$.pipe(
        select(profileConnectionsSelector),
    )
    connectionsLength$: Observable<number> = this.connections$.pipe(
        map(connections => connections.length),
    )
    locality$: Observable<string> = this.store$.pipe(
        select(profileLocalitySelector),
    )

    sentConnection: boolean = false
    incomingConnection: boolean = false
    isConnection: boolean = false

    myProfile = { id: 0 }
    profile = { id: 0 }

    sendConnection(message: string): void {
        this.store$.dispatch(
            new ProfileSendConnectionAction({
                senderId: this.myProfile.id,
                userId: this.profile.id,
                message,
            }),
        )
    }

    acceptConnection(): void {
        this.store$.dispatch(
            new ProfileAcceptConnectionAction({
                senderId: this.profile.id,
                userId: this.myProfile.id,
                date: Date.now(),
            }),
        )
    }

    declineConnection(): void {
        this.store$.dispatch(
            new ProfileDeclineConnectionAction({
                senderId: this.myProfile.id,
                userId: this.profile.id,
            }),
        )
    }

    removeConnection(): void {
        this.store$.dispatch(
            new ProfileRemoveConnectionAction({
                senderId: this.myProfile.id,
                userId: this.profile.id,
            }),
        )
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
        const sendConnectionModal = new HystModal({
            linkAttributeName: 'data-hystmodal',
        })

        const profile$ = this.store$.pipe(select(profileSelector))

        this.store$
            .pipe(select(myProfileSelector))
            .subscribe(res => (this.myProfile = res))

        profile$.subscribe(res => {
            this.profile = res
            this.store$
                .pipe(
                    select(profileSentConnectionsSelector),
                    map(incoming =>
                        incoming.some(
                            user => user.userId === this.myProfile.id,
                        ),
                    ),
                )
                .subscribe(resp => (this.incomingConnection = resp))
        })

        profile$
            .pipe(
                map(user => user.info.receivedConnections),
                map(received =>
                    received.some(user => user.userId === this.myProfile.id),
                ),
            )
            .subscribe(res => (this.sentConnection = res))

        profile$
            .pipe(
                map(user => user.info.connections),
                map(connections =>
                    connections.some(user => user.userId === this.myProfile.id),
                ),
            )
            .subscribe(res => (this.isConnection = res))
    }
}
