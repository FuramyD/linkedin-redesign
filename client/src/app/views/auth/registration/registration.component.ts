import {Component, OnDestroy, OnInit} from '@angular/core'
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms'
import { environment } from 'src/environments/environment'
import { AuthService } from 'src/app/services/auth.service'
import {debounceTime, takeUntil} from 'rxjs/operators'
import { IsdCountryCode } from '../../../../../../server/src/interfaces/auth/isdCountryCode'
import { RegistrationForm } from '../../../../../../server/src/interfaces/auth/registration'
import { IAuthError } from '../../../../../../server/src/interfaces/auth/authError'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.less', '../auth.styles.less'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
    constructor(private authService: AuthService, private router: Router) {}

    unsub$ = new Subject()

    IsdCountryCodes: IsdCountryCode[] | undefined

    repeatPasswordError = false
    backendError = ''

    registrationForm = new FormGroup({
        firstName: new FormControl('', [
            Validators.minLength(2),
            Validators.required,
        ]),
        lastName: new FormControl('', [
            Validators.minLength(2),
            Validators.required,
        ]),
        email: new FormControl('', [Validators.email, Validators.required]),
        phone: new FormControl('', [
            Validators.required,
            Validators.pattern('[- +()0-9]{5,}'),
        ]),
        password: new FormControl('', [
            Validators.minLength(6),
            Validators.required,
        ]),
        passwordRepeat: new FormControl('', [
            Validators.minLength(6),
            Validators.required,
        ]),
    })

    onSubmit(): void {
        const form: RegistrationForm = this.registrationForm.value
        if (form.password === form.passwordRepeat) {
            this.repeatPasswordError = false
            if (this.registrationForm.valid) {
                this.authService
                    .signUpRequest(this.registrationForm.value)
                    .subscribe(
                        res => {
                            console.log(res)
                            this.router.navigate(['/signin'], {
                                queryParams: {
                                    message:
                                        'You have successfully registered and you can log in',
                                },
                            })
                        },
                        err => (this.backendError = err.error.error),
                    )
            }
        } else {
            this.repeatPasswordError = true
        }
    }

    ngOnInit(): void {
        this.authService
            .getIsdCountryCode()
            .pipe(takeUntil(this.unsub$))
            .subscribe(val => (this.IsdCountryCodes = val))

        this.registrationForm.valueChanges
            .pipe(debounceTime(600))
            .subscribe(form => {
                if (form.password === form.passwordRepeat)
                    this.repeatPasswordError = false
                else this.repeatPasswordError = true
            })
    }



    ngOnDestroy(): void {
        this.unsub$.next()
        this.unsub$.complete()
    }
}
