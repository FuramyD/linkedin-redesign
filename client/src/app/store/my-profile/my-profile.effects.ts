import { Injectable } from '@angular/core'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { ProfileService } from '../../services/profile.service'
import {
    ACCEPT_CONNECTION_ACTION_TYPE,
    ACCEPT_CONNECTION_SUCCESS_ACTION_TYPE,
    CANCEL_CONNECTION_ACTION_TYPE,
    DECLINE_CONNECTION_ACTION_TYPE,
    GET_MY_PROFILE_INFO_ACTION_TYPE,
    JOIN_TO_CHAT,
    MyProfileAcceptConnectionAction,
    MyProfileAcceptConnectionSuccessAction,
    MyProfileActions,
    MyProfileCancelConnectionAction,
    MyProfileCancelConnectionSuccessAction,
    MyProfileDeclineConnectionAction,
    MyProfileDeclineConnectionSuccessAction,
    MyProfileGetInfoAction,
    MyProfileGetInfoSuccessAction,
} from './my-profile.actions'
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { IUser } from '../../interfaces/user'
import { EMPTY, Observable } from 'rxjs'
import { ChatService } from '../../services/chat.service'

@Injectable()
export class MyProfileEffects {
    constructor(
        private actions$: Actions,
        private profileService: ProfileService,
        private chatService: ChatService,
        private http: HttpClient,
    ) {}

    @Effect()
    getProfileInfo$(): Observable<MyProfileActions> {
        return this.actions$.pipe(
            ofType(GET_MY_PROFILE_INFO_ACTION_TYPE),
            switchMap((action: MyProfileGetInfoAction) => {
                if (Number.isInteger(action.payload.id)) {
                    return this.profileService
                        .getProfileInfo<{ user: IUser }>(action.payload.id)
                        .pipe(
                            map(res => {
                                console.log(res.user)
                                return new MyProfileGetInfoSuccessAction({
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
    acceptConnection$(): Observable<MyProfileActions> {
        return this.actions$.pipe(
            ofType(ACCEPT_CONNECTION_ACTION_TYPE),
            switchMap((action: MyProfileAcceptConnectionAction) => {
                const payload = action.payload
                return this.profileService
                    .acceptConnection(
                        payload.senderId,
                        payload.userId,
                        payload.date,
                    )
                    .pipe(
                        map(
                            res => {
                                this.chatService.joinToChat(res.chatId)
                                return new MyProfileAcceptConnectionSuccessAction({
                                    senderId: payload.senderId,
                                    date: payload.date,
                                })
                            }
                        ),
                        catchError(err => {
                            console.log(
                                'MyProfileAcceptConnectionAction error: ',
                                err,
                            )
                            return EMPTY
                        }),
                    )
            }),
        )
    }

    @Effect()
    declineConnection$(): Observable<MyProfileActions> {
        return this.actions$.pipe(
            ofType(DECLINE_CONNECTION_ACTION_TYPE),
            switchMap((action: MyProfileDeclineConnectionAction) => {
                const payload = action.payload
                return this.profileService
                    .declineConnection(payload.senderId, payload.userId)
                    .pipe(
                        map(
                            () =>
                                new MyProfileDeclineConnectionSuccessAction({
                                    senderId: payload.senderId,
                                }),
                        ),
                        catchError(err => {
                            console.log(
                                'MyProfileDeclineConnectionAction error:',
                                err,
                            )
                            return EMPTY
                        }),
                    )
            }),
        )
    }

    @Effect()
    cancelConnection$(): Observable<MyProfileActions> {
        return this.actions$.pipe(
            ofType(CANCEL_CONNECTION_ACTION_TYPE),
            switchMap((action: MyProfileCancelConnectionAction) => {
                const payload = action.payload
                return this.profileService
                    .cancelConnection(payload.senderId, payload.userId)
                    .pipe(
                        map(
                            () =>
                                new MyProfileCancelConnectionSuccessAction({
                                    userId: payload.userId,
                                }),
                        ),
                        catchError(err => EMPTY),
                    )
            }),
        )
    }
}
