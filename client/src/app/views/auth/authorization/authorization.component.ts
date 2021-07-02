import {Component, OnDestroy, OnInit} from '@angular/core'
import { AuthService } from '../../../services/auth.service'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AuthForm } from '../../../../../../server/src/interfaces/auth/auth'
import { ActivatedRoute, Router } from '@angular/router'
import { SignInAction } from '../../../store/auth/auth.actions'
import { AuthState } from '../../../store/auth/auth.reducer'
import { Store } from '@ngrx/store'
import { MyProfileState } from '../../../store/my-profile/my-profile.reducer'
import { MyProfileGetInfoSuccessAction } from '../../../store/my-profile/my-profile.actions'
import { IUser } from '../../../interfaces/user'
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
    selector: 'app-authorization',
    templateUrl: './authorization.component.html',
    styleUrls: ['./authorization.component.less', '../auth.styles.less'],
})
export class AuthorizationComponent implements OnInit, OnDestroy {
    constructor(
        private authService: AuthService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private store$: Store<AuthState | MyProfileState>,
    ) {}

    unsub$ = new Subject()

    message: string = ''
    backendError = ''

    authForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required]),
    })

    onSubmit(): void {
        const form: AuthForm = this.authForm.value
        if (this.authForm.valid) {
            this.authService.signInRequest(form).subscribe(
                res => {
                    console.log('SERVER AUTH RESPONSE', res)
                    this.store$.dispatch(new SignInAction())
                    this.store$.dispatch(
                        new MyProfileGetInfoSuccessAction({
                            profile: res.user,
                        }),
                    )
                    localStorage.setItem('currentUser', JSON.stringify(res))
                    this.router.navigate(['/feed'])
                },
                err => (this.backendError = err.error.error),
            )
        }
    }

    ngOnInit(): void {
        // this.authService.testReq()

        this.activatedRoute.queryParams.pipe(takeUntil(this.unsub$)).subscribe(params => {
            if (params.message) {
                this.message = params.message
            }
        })

        console.log(this.message)
    }

    ngOnDestroy(): void {
        this.unsub$.next()
        this.unsub$.complete()
    }
}
