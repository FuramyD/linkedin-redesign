import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { environment } from 'src/environments/environment'
import { AuthService } from 'src/app/services/auth.service'
import { debounceTime } from 'rxjs/operators'
import { IsdCountryCode } from 'src/app/interfaces/isdCountryCode'

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.less', '../auth.styles.less'],
})
export class RegistrationComponent implements OnInit {
    constructor(private authService: AuthService) {}

    IsdCountryCodes: IsdCountryCode[] | undefined

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
            Validators.minLength(2),
            Validators.required,
        ]),
        password: new FormControl('', [
            Validators.minLength(2),
            Validators.required,
        ]),
        passwordRepeat: new FormControl('', [
            Validators.minLength(2),
            Validators.required,
        ]),
    })

    onSubmit(): void {
        console.log(this.registrationForm)
        if (this.registrationForm.valid) {
            this.authService
                .signUpRequest(this.registrationForm.value)
                .subscribe(
                    res => console.log(res),
                    err => console.log('err => ', err.error),
                )
        }
    }

    ngOnInit(): void {
        this.registrationForm.valueChanges
            .pipe(debounceTime(500))
            .subscribe(val => console.log(val))
        this.registrationForm.statusChanges.subscribe(status =>
            console.log('Status: ', status),
        )

        this.authService
            .getIsdCountryCode()
            .subscribe(val => (this.IsdCountryCodes = val))
    }
}
