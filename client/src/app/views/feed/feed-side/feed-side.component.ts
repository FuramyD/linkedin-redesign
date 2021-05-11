import { Component, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { MyProfileState } from '../../../store/my-profile/my-profile.reducer'
import { Observable } from 'rxjs'
import { myProfileSelector } from '../../../store/my-profile/my-profile.selectors'
import { map } from 'rxjs/operators'
import { IBuffer } from '../../../interfaces/buffer'

@Component({
    selector: 'app-feed-side',
    templateUrl: './feed-side.component.html',
    styleUrls: ['./feed-side.component.less', '../feed.component.less'],
})
export class FeedSideComponent implements OnInit {
    constructor(private store$: Store<MyProfileState>) {}

    profile$: Observable<MyProfileState> = this.store$.pipe(
        select(myProfileSelector),
    )

    fullName$: Observable<string> = this.profile$.pipe(
        map(profile => `${profile.firstName} ${profile.lastName}`),
    )

    description$: Observable<string> = this.profile$.pipe(
        map(profile => profile.info.description),
    )

    avatar$: Observable<string> = this.profile$.pipe(
        map(profile => profile.info.avatar?.url ?? 'assets/img/avatar-man.png'),
    )

    ngOnInit(): void {}
}
