import { Injectable } from '@angular/core'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { EMPTY, Observable } from 'rxjs'
import {
    FIND_USERS_BY_FULL_NAME_ACTION_TYPE,
    FindUsersActions,
    FindUsersByFullNameAction,
} from './find-users.actions'
import { catchError, map, switchMap } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../environments/environment'

@Injectable()
export class FindUsersEffects {
    constructor(private actions$: Actions, private http: HttpClient) {}

    @Effect()
    findUsersByFullName$(): Observable<FindUsersActions> {
        return this.actions$.pipe(
            ofType(FIND_USERS_BY_FULL_NAME_ACTION_TYPE),
            switchMap((action: FindUsersByFullNameAction) => {
                return this.http
                    .get(
                        `${environment.server_url}/users/find/all?fullName=${action.payload.fullName}`,
                    )
                    .pipe(
                        map(users => {
                            return
                        }),
                        catchError(error => {
                            console.warn(error)
                            return EMPTY
                        }),
                    )
            }),
        )
    }
}
