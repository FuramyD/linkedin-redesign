import { Injectable } from '@angular/core'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { EMPTY, Observable } from 'rxjs'
import {
    ChatActions,
    LOAD_CHATS,
    LoadChatsAction,
    LoadChatsSuccessAction,
} from './chat.actions'
import { catchError, map, switchMap } from 'rxjs/operators'
import { environment } from '../../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { IChat } from '../../interfaces/chat/chat'
import { IUser } from '../../interfaces/user'
import { ProfileService } from '../../services/profile.service'
import { Chat } from './chat.reducer'

@Injectable()
export class ChatEffects {
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private profileService: ProfileService,
    ) {}

    @Effect()
    loadChats$(): Observable<ChatActions> {
        console.log('loading chats...')
        return this.actions$.pipe(
            ofType(LOAD_CHATS),
            switchMap((action: LoadChatsAction) => {
                const { profileId } = action.payload
                return this.http
                    .get<{ chats: IChat[] }>(
                        `${environment.server_url}/chats/find/all`,
                    )
                    .pipe(
                        switchMap(resp => {
                            return this.http
                                .get<{ user: IUser }>(
                                    `${environment.server_url}/users/find/${profileId}`,
                                )
                                .pipe(
                                    switchMap(res => {
                                        const connections =
                                            res.user.info.connections
                                        return this.profileService.getConnectionsById$(
                                            connections,
                                        )
                                    }),
                                    map((res: { user: IUser }[]) => {
                                        const chats: Chat[] = resp.chats
                                            .filter(chat =>
                                                chat.users.some(
                                                    u => u.userId === profileId,
                                                ),
                                            )
                                            .map(chat => {
                                                const buddyId =
                                                    chat.users.find(
                                                        u =>
                                                            u.userId !==
                                                            profileId,
                                                    )?.userId ?? -1
                                                const buddy = res.find(
                                                    u => u.user.id === buddyId,
                                                )?.user as IUser
                                                return {
                                                    chat,
                                                    buddy,
                                                }
                                            })
                                        console.log('chats:', chats)
                                        return chats
                                    }),
                                )
                        }),
                        map(
                            (chats: Chat[]) =>
                                new LoadChatsSuccessAction({ chats }),
                        ),
                        catchError((res: { error: string }) => {
                            console.log(res.error)
                            return EMPTY
                        }),
                    )
            }),
        )
    }

    // @Effect()
    // getCurrentBuddy$(): Observable<ChatActions> {
    //     return this.actions$.pipe(
    //         ofType(GET_CURRENT_BUDDY),
    //         switchMap((action: GetCurrentBuddyAction) => {
    //             return this.http.get<{ user: IUser }>(`${environment.server_url}/users/find/${action.payload.buddyId}`)
    //                 .pipe(
    //                     map(res => new GetCurrentBuddySuccessAction({ buddy: res.user })),
    //                     catchError(err => {
    //                         console.warn(err)
    //                         return EMPTY
    //                     })
    //                 )
    //         })
    //     )
    // }
    //
    // @Effect()
    // getCurrentChatId$(): Observable<ChatActions> {
    //     return this.actions$.pipe(
    //         ofType(GET_CURRENT_CHAT),
    //         switchMap((action: GetCurrentChatAction) => {
    //             const { profileId, buddyId } = action.payload
    //             return this.http.get<{ chats: IChat[] }>(`${environment.server_url}/chats/find/all`)
    //                 .pipe(
    //                     map(res => {
    //                         return res.chats.filter(chat => {
    //                             return chat.users.find(user => user.userId === profileId)
    //                                 && chat.users.find(user => user.userId === buddyId)
    //                         })[0]
    //                     }),
    //                     map(chat => {
    //                         if (chat) return new GetCurrentChatSuccessAction({ chat })
    //                         return new GetCurrentChatFailedAction({ error: 'something went wrong' })
    //                     }),
    //                     catchError(err => {
    //                         console.warn(err)
    //                         return EMPTY
    //                     })
    //                 )
    //         })
    //     )
    // }
}
