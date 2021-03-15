import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.less'],
})
export class AuthComponent implements OnInit {
    constructor(private httpClient: HttpClient) {}

    authForm = new FormGroup({
        firstName: new FormControl(),
        lastName: new FormControl(),
        email: new FormControl(),
        phone: new FormControl(),
        password: new FormControl(),
    })

    ngOnInit(): void {}

    onSubmit(): void {
        this.httpClient
            .post(
                `${environment.server_url}users/add-new`,
                this.authForm.value,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )
            .subscribe(value => console.log(value))
    }
}
