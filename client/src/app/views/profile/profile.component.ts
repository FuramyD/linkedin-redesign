import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { select, Store } from '@ngrx/store'
import { ProfileState } from '../../store/profile/profile.reducer'
import { ProfileGetInfoAction } from '../../store/profile/profile.actions'
import { profileSelector } from '../../store/profile/profile.selectors'
import {
    myProfileIdSelector,
    myProfileSelector,
} from '../../store/my-profile/my-profile.selectors'
import { MyProfileState } from '../../store/my-profile/my-profile.reducer'
import { Observable } from 'rxjs'

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.less'],
})
export class ProfileComponent implements OnInit {
    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private store$: Store<ProfileState | MyProfileState>,
    ) {}

    myProfileId$: Observable<number> = this.store$.pipe(
        select(myProfileIdSelector),
    )
    isMyProfile: boolean = false

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            if (params.id) {
                this.myProfileId$.subscribe(id => {
                    console.log('id:', id, '\nparams id:', params.id)
                    this.isMyProfile = id === +params.id
                })
                console.log('params id:', +params.id)
                this.store$.dispatch(
                    new ProfileGetInfoAction({ id: +params.id }),
                )
            } else {
                this.myProfileId$.subscribe(id => {
                    this.router.navigate([`/profile/${id}`])
                })
            }
        })
    }
}

export const initialProfileState = {
    email: '',
    firstName: '',
    id: 0,
    info: {
        avatar: null,
        connections: [],
        dateOfBirth: 0,
        description: '',
        isOnline: false,
        posts: [],
        profession: '',
        profileHeaderBg: null,
        receivedConnections: [],
        sentConnections: [],
        views: { current: 0, prev: 0 },
    },
    lastName: '',
    password: '',
    phone: '',
}
