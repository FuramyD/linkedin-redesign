import {Component, Input, OnDestroy, OnInit} from '@angular/core'
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
    MyProfileAcceptConnectionAction,
    MyProfileCancelConnectionAction,
    MyProfileDeclineConnectionAction,
    MyProfileGetInfoAction,
} from '../../../store/my-profile/my-profile.actions'
import { filter, map, switchMap } from 'rxjs/operators'

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

    myConnections: { user: IUser, date: number }[] = []
    myProfileId: number = -1

    @Input() activeTab: string = ''
    // ОБЯЗАТЕЛЬНО ВЫНЕСТИ ЭТО В КАКОЙ НИБУДЬ СЕРВИС И ПОХОЖИЕ МАХИНАЦИИ
    myConnections$: Observable<{ user: IUser, date: number }[]> = this.store$.pipe(
        select(myProfileConnectionsSelector),
        switchMap(connections => {
            return this.profileService.getConnectionsById$(connections)
        })
    )

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

        this.sub = this.myConnections$.subscribe(connections => this.myConnections = connections)
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe())
    }
}
