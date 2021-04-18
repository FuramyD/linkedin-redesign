import { Injectable } from '@angular/core'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { ProfileService } from '../../services/profile.service'
import {
    ACCEPT_CONNECTION_ACTION_TYPE,
    DECLINE_CONNECTION_ACTION_TYPE,
    GET_PROFILE_INFO_ACTION_TYPE,
    ProfileAcceptConnectionAction,
    ProfileAcceptConnectionSuccessAction,
    ProfileActions,
    ProfileDeclineConnectionAction,
    ProfileDeclineConnectionSuccessAction,
    ProfileGetInfoAction,
    ProfileGetInfoSuccessAction,
    ProfileRemoveConnectionAction,
    ProfileRemoveConnectionSuccessAction,
    ProfileSendConnectionAction,
    ProfileSendConnectionSuccessAction,
    REMOVE_CONNECTION_ACTION_TYPE,
    SEND_CONNECTION_ACTION_TYPE,
} from './profile.actions'
import { catchError, map, switchMap } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { IUser } from '../../interfaces/user'
import { EMPTY, Observable, of } from 'rxjs'

@Injectable()
export class ProfileEffects {
    constructor(
        private actions$: Actions,
        private profileService: ProfileService,
        private http: HttpClient,
    ) {}

    @Effect()
    getProfileInfo$(): Observable<ProfileActions> {
        return this.actions$.pipe(
            ofType(GET_PROFILE_INFO_ACTION_TYPE),
            switchMap((action: ProfileGetInfoAction) => {
                if (Number.isInteger(action.payload.id)) {
                    return this.profileService
                        .getProfileInfo<{ user: IUser }>(action.payload.id)
                        .pipe(
                            map(res => {
                                return new ProfileGetInfoSuccessAction({
                                    profile: res.user,
                                })
                            }),
                            catchError(() => EMPTY),
                        )
                }
                return EMPTY
            }),
        )
    }

    @Effect()
    sendConnection$(): Observable<ProfileActions> {
        return this.actions$.pipe(
            ofType(SEND_CONNECTION_ACTION_TYPE),
            switchMap((action: ProfileSendConnectionAction) => {
                const payload = action.payload
                return this.profileService
                    .sendConnection(
                        payload.senderId,
                        payload.userId,
                        payload.message,
                    )
                    .pipe(
                        map(() => {
                            return new ProfileSendConnectionSuccessAction({
                                senderId: payload.senderId,
                            })
                        }),
                        catchError(err => {
                            console.log('send connection effect error: ', err)
                            return EMPTY
                        }),
                    )
            }),
        )
    }

    @Effect()
    acceptConnection$(): Observable<ProfileActions> {
        return this.actions$.pipe(
            ofType(ACCEPT_CONNECTION_ACTION_TYPE),
            switchMap((action: ProfileAcceptConnectionAction) => {
                const payload = action.payload
                return this.profileService
                    .acceptConnection(
                        payload.senderId,
                        payload.userId,
                        payload.date,
                    )
                    .pipe(
                        map(
                            () =>
                                new ProfileAcceptConnectionSuccessAction({
                                    userId: payload.userId,
                                    date: payload.date,
                                }),
                        ),
                        catchError(err => {
                            console.log(
                                'ProfileAcceptConnectionAction error: ',
                                err,
                            )
                            return EMPTY
                        }),
                    )
            }),
        )
    }

    @Effect()
    declineConnection$(): Observable<ProfileActions> {
        return this.actions$.pipe(
            ofType(DECLINE_CONNECTION_ACTION_TYPE),
            switchMap((action: ProfileDeclineConnectionAction) => {
                const payload = action.payload
                return this.profileService
                    .declineConnection(payload.senderId, payload.userId)
                    .pipe(
                        map(
                            () =>
                                new ProfileDeclineConnectionSuccessAction({
                                    senderId: payload.senderId,
                                }),
                        ),
                        catchError(err => {
                            console.log(
                                'ProfileDeclineConnectionAction error:',
                                err,
                            )
                            return EMPTY
                        }),
                    )
            }),
        )
    }

    @Effect()
    removeConnection$(): Observable<ProfileActions> {
        return this.actions$.pipe(
            ofType(REMOVE_CONNECTION_ACTION_TYPE),
            switchMap((action: ProfileRemoveConnectionAction) => {
                const payload = action.payload
                return this.profileService
                    .removeConnection(payload.senderId, payload.userId)
                    .pipe(
                        map(
                            () =>
                                new ProfileRemoveConnectionSuccessAction({
                                    senderId: payload.senderId,
                                }),
                        ),
                        catchError(err => {
                            console.log(
                                'ProfileRemoveConnectionAction error:',
                                err,
                            )
                            return EMPTY
                        }),
                    )
            }),
        )
    }
}
