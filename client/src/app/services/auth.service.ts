import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { RegistrationForm } from '../../../../server/src/interfaces/auth/registration'
import { AuthForm } from '../../../../server/src/interfaces/auth/auth'
import { IsdCountryCode } from '../../../../server/src/interfaces/auth/isdCountryCode'
import { MyProfileState } from '../store/my-profile/my-profile.reducer'
import { map } from 'rxjs/operators'
import { IUser } from '../interfaces/user'

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    isAuth: boolean

    constructor(private http: HttpClient) {
        this.isAuth = false
    }

    signUpRequest(formValue: RegistrationForm): Observable<RegistrationForm> {
        formValue.passwordRepeat = undefined
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

    signInRequest(formValue: AuthForm): Observable<{ user: IUser }> {
        return this.http
            .post<{ user: IUser }>(
                `${environment.server_url}/users/auth`,
                formValue,
            )
            .pipe(
                map(res => {
                    console.log(res)
                    return res
                }),
            )
    }

    getIsdCountryCode(): Observable<IsdCountryCode[]> {
        return this.http.get<IsdCountryCode[]>(
            'https://gist.githubusercontent.com/iamswapnilsonar/0e1868229e98cc27a6d2e3487b44f7fa/raw/10f8979f0b1daa0e0b490137d51fb96736767a09/isd_country_code.json',
        )
    }

    testReq(): void {
        this.http
            .get(`${environment.server_url}/users/test`)
            .subscribe(res => console.log(res))
    }
}
