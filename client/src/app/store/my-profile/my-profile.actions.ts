/* ACTION TYPES */
import { Action } from '@ngrx/store'
import { MyProfileState } from './my-profile.reducer'
import { IUser } from '../../interfaces/user'

export const GET_MY_PROFILE_INFO_ACTION_TYPE = '[MY PROFILE] get info'
export const GET_MY_PROFILE_INFO_SUCCESS_ACTION_TYPE =
    '[MY PROFILE] get info success'

export const ACCEPT_CONNECTION_ACTION_TYPE = '[MY PROFILE] accept connection'
export const ACCEPT_CONNECTION_SUCCESS_ACTION_TYPE =
    '[MY PROFILE] success accept connection'

export const DECLINE_CONNECTION_ACTION_TYPE = '[MY PROFILE] decline connection'
export const DECLINE_CONNECTION_SUCCESS_ACTION_TYPE =
    '[MY PROFILE] success decline connection'

export const CANCEL_CONNECTION_ACTION_TYPE = '[MY PROFILE] cancel connection'
export const CANCEL_CONNECTION_SUCCESS_ACTION_TYPE =
    '[MY PROFILE] success cancel connection'

export const JOIN_TO_CHAT = '[MY PROFILE] join to chat'

/* ACTIONS */

export class MyProfileGetInfoAction implements Action {
    readonly type = GET_MY_PROFILE_INFO_ACTION_TYPE

    constructor(
        public payload: {
            id: number
        },
    ) {}
}

export class MyProfileGetInfoSuccessAction implements Action {
    readonly type = GET_MY_PROFILE_INFO_SUCCESS_ACTION_TYPE
    constructor(
        public payload: {
            profile: IUser
        },
    ) {}
}

export class MyProfileAcceptConnectionAction implements Action {
    readonly type = ACCEPT_CONNECTION_ACTION_TYPE

    constructor(
        public payload: {
            senderId: number
            userId: number
            date: number
        },
    ) {}
}

export class MyProfileDeclineConnectionAction implements Action {
    readonly type = DECLINE_CONNECTION_ACTION_TYPE

    constructor(
        public payload: {
            senderId: number
            userId: number
        },
    ) {}
}

export class MyProfileCancelConnectionAction implements Action {
    readonly type = CANCEL_CONNECTION_ACTION_TYPE
    constructor(
        public payload: {
            senderId: number
            userId: number
        },
    ) {}
}

export class MyProfileAcceptConnectionSuccessAction implements Action {
    readonly type = ACCEPT_CONNECTION_SUCCESS_ACTION_TYPE

    constructor(
        public payload: {
            senderId: number,
            date: number
        },
    ) {}
}

export class MyProfileDeclineConnectionSuccessAction implements Action {
    readonly type = DECLINE_CONNECTION_SUCCESS_ACTION_TYPE

    constructor(
        public payload: {
            senderId: number
        },
    ) {}
}

export class MyProfileCancelConnectionSuccessAction implements Action {
    readonly type = CANCEL_CONNECTION_SUCCESS_ACTION_TYPE
    constructor(
        public payload: {
            userId: number
        },
    ) {}
}

export type MyProfileActions =
    | MyProfileGetInfoAction
    | MyProfileGetInfoSuccessAction
    | MyProfileAcceptConnectionAction
    | MyProfileAcceptConnectionSuccessAction
    | MyProfileDeclineConnectionAction
    | MyProfileDeclineConnectionSuccessAction
    | MyProfileCancelConnectionAction
    | MyProfileCancelConnectionSuccessAction
