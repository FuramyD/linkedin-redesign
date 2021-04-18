import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { AuthState } from './store/auth/auth.reducer'
import { SignInAction } from './store/auth/auth.actions'
import { MyProfileState } from './store/my-profile/my-profile.reducer'
import { MyProfileGetInfoAction } from './store/my-profile/my-profile.actions'
import { WebSocketService } from './services/web-socket.service'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
    title = 'client'

    constructor(
        private store$: Store<AuthState | MyProfileState>,
        private webSocketService: WebSocketService,
    ) {}

    ngOnInit(): void {
        if (localStorage.getItem('currentUser')) {
            this.store$.dispatch(new SignInAction())
            this.store$.dispatch(
                new MyProfileGetInfoAction({
                    id: JSON.parse(
                        localStorage.getItem('currentUser') as string,
                    ).user.id,
                }),
            )
        }

        this.webSocketService
            .listen('some event')
            .subscribe(data => console.log(data))
    }
}
