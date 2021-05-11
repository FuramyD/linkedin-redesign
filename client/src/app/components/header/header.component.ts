import { Component, OnInit } from '@angular/core'
import { ProfileService } from '../../services/profile.service'

import { IRoute } from '../../../../../server/src/interfaces/route'
import { Observable, of } from 'rxjs'
import { MyProfileState } from '../../store/my-profile/my-profile.reducer'
import { select, Store } from '@ngrx/store'

import { map } from 'rxjs/operators'
import {
    myProfileAvatarSelector,
    myProfileCurrentViewsSelector,
    myProfileNameSelector,
    myProfilePrevViewsSelector,
} from '../../store/my-profile/my-profile.selectors'
import { IBuffer } from '../../interfaces/buffer'

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less'],
})
export class HeaderComponent implements OnInit {
    constructor(
        private profileService: ProfileService,
        private store$: Store<MyProfileState>,
    ) {}

    prevViews$: Observable<number> = this.store$.pipe(
        select(myProfilePrevViewsSelector),
    )
    currentViews$: Observable<number> = this.store$.pipe(
        select(myProfileCurrentViewsSelector),
    )
    fullName$: Observable<string> = this.store$.pipe(
        select(myProfileNameSelector),
        map(name => `${name.firstName[0]}. ${name.lastName}`),
    )
    avatar$: Observable<string> = this.store$.pipe(
        select(myProfileAvatarSelector),
        map(avatar => {
            return avatar
        }),
    )

    routes: IRoute[] = [
        { path: '/feed', icon: 'feed', name: 'feed' },
        { path: '/network', icon: 'network', name: 'network' },
        { path: '/jobs', icon: 'jobs', name: 'jobs' },
        { path: '/chats', icon: 'chats', name: 'chats' },
        { path: '/notices', icon: 'notices', name: 'notices' },
    ]
    location: Location = location

    viewsProgress(): number {
        let prev: number
        let current: number
        this.currentViews$.subscribe(res => {
            current = res
        })
        this.prevViews$.subscribe(res => {
            prev = res
        })
        // @ts-ignore
        return current - prev
    }

    trendingIcon(): string {
        if (this.viewsProgress() > 0) return 'trendingUp'
        if (this.viewsProgress() < 0) return 'trendingDown'
        return 'trendingFlat'
    }

    ngOnInit(): void {}
}
