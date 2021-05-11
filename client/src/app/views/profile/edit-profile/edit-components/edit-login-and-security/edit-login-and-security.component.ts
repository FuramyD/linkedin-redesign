import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'

// @ts-ignore
import { HystModal } from '../../../../../plugins/hystModal_.js'
import { ProfileService } from '../../../../../services/profile.service'
import { Router } from '@angular/router'

@Component({
    selector: 'app-edit-login-and-security',
    templateUrl: './edit-login-and-security.component.html',
    styleUrls: ['./edit-login-and-security.component.less'],
})
export class EditLoginAndSecurityComponent implements OnInit {
    constructor(
        private profileService: ProfileService,
        private router: Router,
    ) {}

    @Input() profileId: number = -1
    @Input() email: string = ''
    @Input() phone: string = ''
    @Input() dateOfLastPasswordUpdate: number | null = null

    @Input() phoneConfirmed: boolean = false
    @Input() emailConfirmed: boolean = false

    @Output() action = new EventEmitter<{ type: string; data: any }>()

    isChangePhone: boolean = false
    isChangeEmail: boolean = false
    isChangePassword: boolean = false

    changePhoneError: string = ''
    changeEmailError: string = ''
    changePasswordError: string = ''

    changePasswordForm = new FormGroup({
        currentPassword: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
        ]),
        newPassword: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
        ]),
        newPasswordRepeat: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
        ]),
    })

    changePhoneMode(): void {
        this.isChangePhone = true
        this.isChangeEmail = false
        this.isChangePassword = false
    }
    changeEmailMode(): void {
        this.isChangePhone = false
        this.isChangeEmail = true
        this.isChangePassword = false
    }
    changePasswordMode(): void {
        this.isChangePhone = false
        this.isChangeEmail = false
        this.isChangePassword = true
    }

    closeChangeBlock(): void {
        this.isChangePhone = false
        this.isChangeEmail = false
        this.isChangePassword = false
    }

    deleteAccount(password: string): void {
        this.profileService.deleteAccount(this.profileId, password).subscribe(
            res => {
                localStorage.removeItem('currentUser')
                this.router.navigate(['/account-deleted'])
            },
            err => {},
        )
    }

    changeEmail(email: string): void {
        const match = email.match(/.+@.+\..+/i)

        console.log(match)

        if (!match) {
            this.changeEmailError = 'Invalid email'
            return
        }

        if (this.email === email) {
            this.changeEmailError = 'Email addresses match'
            return
        }

        this.profileService.changeEmail(this.profileId, email).subscribe(
            res => {
                console.log(res.message)
            },
            err => {
                console.error(err.message)
            },
        )
    }

    changePhone(phone: string): void {
        const match = phone.match(/^[- +()0-9]{5,}/)

        if (!match) {
            this.changePhoneError = 'Invalid phone'
            return
        }

        if (this.phone === phone) {
            this.changePhoneError = 'Phones match'
            return
        }

        this.profileService.changePhone(this.profileId, phone).subscribe(
            res => {
                console.log(res.message)
            },
            err => {
                console.error(err.message)
            },
        )
    }

    changePassword(): void {
        const form = this.changePasswordForm.value
        if (form.newPassword !== form.newPasswordRepeat) {
            this.changePasswordError = 'Password mismatch'
            return
        }
        if (form.newPassword === form.currentPassword) {
            this.changePasswordError = 'Old and new passwords are the same'
            return
        }

        if (form.newPassword.length < 6) {
            this.changePasswordError = 'New password is too short'
            return
        }

        this.profileService
            .changePassword(
                this.profileId,
                form.newPassword,
                form.currentPassword,
            )
            .subscribe(
                res => {
                    console.log(res.message)
                },
                err => {
                    console.error(err.message)
                },
            )
    }

    ngOnInit(): void {
        const deleteAccountModal = new HystModal({
            linkAttributeName: 'data-hystmodal',
        })
    }
}
