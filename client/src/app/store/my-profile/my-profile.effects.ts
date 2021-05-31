import { Injectable } from '@angular/core'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { ProfileService } from '../../services/profile.service'
import {
    ACCEPT_CONNECTION_ACTION_TYPE,
    CANCEL_CONNECTION_ACTION_TYPE,
    DECLINE_CONNECTION_ACTION_TYPE,
    GET_MY_PROFILE_INFO_ACTION_TYPE,
    REMOVE_CONNECTION_ACTION_TYPE,
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
    MyProfileRemoveConnectionAction,
    MyProfileRemoveConnectionSuccessAction,
    MyProfileChangeRoleAction,
    CHANGE_ROLE_ACTION_TYPE,
    CHANGE_ABOUT_ACTION_TYPE,
    MyProfileChangeAboutAction,
    CHANGE_PROFESSION_ACTION_TYPE,
    MyProfileChangeProfessionAction,
    MyProfileChangeRoleSuccessAction,
    MyProfileChangeAboutSuccessAction,
    MyProfileChangeProfessionSuccessAction,
    MyProfileChangeLocalityAction,
    MyProfileChangeLocalitySuccessAction,
    CHANGE_LOCALITY_ACTION_TYPE,
    MyProfileChangeContactInfoAction,
    CHANGE_CONTACT_INFO_ACTION_TYPE,
    MyProfileChangeContactInfoSuccessAction,
    CHANGE_PROJECTS_ACTION_TYPE,
    MyProfileChangeProjectsAction,
    MyProfileChangeProjectsSuccessAction,
    CHANGE_EXPERIENCE_ACTION_TYPE,
    MyProfileChangeExperienceAction,
    MyProfileChangeEducationSuccessAction,
    CHANGE_EDUCATION_ACTION_TYPE,
    MyProfileChangeEducationAction,
    MyProfileChangeExperienceSuccessAction,
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
            mergeMap((action: MyProfileAcceptConnectionAction) => {
                const payload = action.payload
                return this.profileService
                    .acceptConnection(
                        payload.senderId,
                        payload.userId,
                        payload.date,
                    )
                    .pipe(
                        map(res => {
                            this.chatService.joinToChat(res.chatId)
                            return new MyProfileAcceptConnectionSuccessAction({
                                senderId: payload.senderId,
                                date: payload.date,
                            })
                        }),
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
            mergeMap((action: MyProfileDeclineConnectionAction) => {
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
            mergeMap((action: MyProfileCancelConnectionAction) => {
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

    @Effect()
    removeConnection$(): Observable<MyProfileActions> {
        return this.actions$.pipe(
            ofType(REMOVE_CONNECTION_ACTION_TYPE),
            mergeMap((action: MyProfileRemoveConnectionAction) => {
                const payload = action.payload
                return this.profileService
                    .removeConnection(payload.senderId, payload.userId)
                    .pipe(
                        map(
                            () =>
                                new MyProfileRemoveConnectionSuccessAction({
                                    userId: payload.userId,
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

    @Effect()
    changeRole$(): Observable<MyProfileActions> {
        return this.actions$.pipe(
            ofType(CHANGE_ROLE_ACTION_TYPE),
            mergeMap((action: MyProfileChangeRoleAction) => {
                const { role, id } = action.payload
                return this.profileService
                    .changeRole(role, id)
                    .pipe(
                        map(changed => {
                            console.log(changed)
                            return new MyProfileChangeRoleSuccessAction({ role })
                        }),
                        catchError(err => {
                            console.log(err)
                            return EMPTY
                        })
                    )
            })
        )
    }

    // changeCompany$(): Observable<MyProfileActions> {}

    @Effect()
    changeAbout$(): Observable<MyProfileActions> {
        return this.actions$.pipe(
            ofType(CHANGE_ABOUT_ACTION_TYPE),
            mergeMap((action: MyProfileChangeAboutAction) => {
                const { about, id } = action.payload
                return this.profileService
                    .changeAbout(about, id)
                    .pipe(
                        map(changed => {
                            console.log(changed)
                            return new MyProfileChangeAboutSuccessAction({ about })
                        }),
                        catchError(err => {
                            console.log(err)
                            return EMPTY
                        })
                    )
            })
        )
    }

    @Effect()
    changeProfession$(): Observable<MyProfileActions> {
        return this.actions$.pipe(
            ofType(CHANGE_PROFESSION_ACTION_TYPE),
            mergeMap((action: MyProfileChangeProfessionAction) => {
                const { profession, id } = action.payload
                return this.profileService
                    .changeProfession(profession, id)
                    .pipe(
                        map(changed => {
                            console.log(changed)
                            return new MyProfileChangeProfessionSuccessAction({ profession })
                        }),
                        catchError(err => {
                            console.log(err)
                            return EMPTY
                        })
                    )
            })
        )
    }

    @Effect()
    changeLocality$(): Observable<MyProfileActions> {
        return this.actions$.pipe(
            ofType(CHANGE_LOCALITY_ACTION_TYPE),
            mergeMap((action: MyProfileChangeLocalityAction) => {
                const { locality, id } = action.payload
                return this.profileService
                    .changeLocality(locality, id)
                    .pipe(
                        map(changed => {
                            console.log(changed)
                            return new MyProfileChangeLocalitySuccessAction({ locality })
                        }),
                        catchError(err => {
                            console.log(err)
                            return EMPTY
                        })
                    )
            })
        )
    }

    @Effect()
    changeContactInfo$(): Observable<MyProfileActions> {
        return this.actions$.pipe(
            ofType(CHANGE_CONTACT_INFO_ACTION_TYPE),
            mergeMap((action: MyProfileChangeContactInfoAction) => {
                const { contactInfo, id } = action.payload
                return this.profileService
                    .changeContactInfo(contactInfo, id)
                    .pipe(
                        map(changed => {
                            console.log(changed)
                            return new MyProfileChangeContactInfoSuccessAction({ contactInfo })
                        }),
                        catchError(err => {
                            console.log(err)
                            return EMPTY
                        })
                    )
            })
        )
    }

    @Effect()
    changeProjects$(): Observable<MyProfileActions> {
        return this.actions$.pipe(
            ofType(CHANGE_PROJECTS_ACTION_TYPE),
            mergeMap((action: MyProfileChangeProjectsAction) => {
                const { projects, id } = action.payload
                return this.profileService
                    .changeProjects(projects, id)
                    .pipe(
                        map(changed => {
                            console.log(changed)
                            return new MyProfileChangeProjectsSuccessAction({ projects })
                        }),
                        catchError(err => {
                            console.log(err)
                            return EMPTY
                        })
                    )
            })
        )
    }

    @Effect()
    changeExperience$(): Observable<MyProfileActions> {
        return this.actions$.pipe(
            ofType(CHANGE_EXPERIENCE_ACTION_TYPE),
            mergeMap((action: MyProfileChangeExperienceAction) => {
                const { experience, id } = action.payload
                return this.profileService
                    .changeExperience(experience, id)
                    .pipe(
                        map(changed => {
                            console.log(changed)
                            return new MyProfileChangeExperienceSuccessAction({ experience })
                        }),
                        catchError(err => {
                            console.log(err)
                            return EMPTY
                        })
                    )
            })
        )
    }

    @Effect()
    changeEducation$(): Observable<MyProfileActions> {
        return this.actions$.pipe(
            ofType(CHANGE_EDUCATION_ACTION_TYPE),
            mergeMap((action: MyProfileChangeEducationAction) => {
                const { education, id } = action.payload
                return this.profileService
                    .changeEducation(education, id)
                    .pipe(
                        map(changed => {
                            console.log(changed)
                            return new MyProfileChangeEducationSuccessAction({ education })
                        }),
                        catchError(err => {
                            console.log(err)
                            return EMPTY
                        })
                    )
            })
        )
    }
}
