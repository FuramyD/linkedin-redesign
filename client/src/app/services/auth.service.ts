import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { RegistrationForm } from '../interfaces/registration'
import { AuthForm } from '../interfaces/auth'
import { IsdCountryCode } from '../interfaces/isdCountryCode'

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private http: HttpClient) {}

    signUpRequest(formValue: RegistrationForm): Observable<RegistrationForm> {
        return this.http.post<RegistrationForm>(
            `${environment.server_url}/users/create`,
            formValue,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        )
    }

    signInRequest(formValue: AuthForm): Observable<AuthForm> {
        return this.http.post<AuthForm>(
            `${environment.server_url}/users/findOne`,
            formValue,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        )
    }

    getIsdCountryCode(): Observable<IsdCountryCode[]> {
        return this.http.get<IsdCountryCode[]>(
            'https://gist.githubusercontent.com/iamswapnilsonar/0e1868229e98cc27a6d2e3487b44f7fa/raw/10f8979f0b1daa0e0b490137d51fb96736767a09/isd_country_code.json',
        )
    }
}
