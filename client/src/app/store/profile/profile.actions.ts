/* ACTION TYPES */
import { Action } from '@ngrx/store'
import { ProfileState } from './profile.reducer'
import { IUser } from '../../interfaces/user'

export const GET_PROFILE_INFO_ACTION_TYPE = '[PROFILE] get info'
export const GET_PROFILE_INFO_SUCCESS_ACTION_TYPE = '[PROFILE] success get info'

export const SEND_CONNECTION_ACTION_TYPE = '[PROFILE] send connection'
export const ACCEPT_CONNECTION_ACTION_TYPE = '[PROFILE] accept connection'
export const DECLINE_CONNECTION_ACTION_TYPE = '[PROFILE] decline connection'
export const REMOVE_CONNECTION_ACTION_TYPE = '[PROFILE] remove connection'

export const SEND_CONNECTION_SUCCESS_ACTION_TYPE =
    '[PROFILE] success send connection'
export const ACCEPT_CONNECTION_SUCCESS_ACTION_TYPE =
    '[PROFILE] success accept connection'
export const DECLINE_CONNECTION_SUCCESS_ACTION_TYPE =
    '[PROFILE] success decline connection'
export const REMOVE_CONNECTION_SUCCESS_ACTION_TYPE =
    '[PROFILE] success remove connection'

/* ACTIONS */

/*  GET INFO  */

export class ProfileGetInfoAction implements Action {
    readonly type = GET_PROFILE_INFO_ACTION_TYPE
    constructor(
        public payload: {
            id: number
        },
    ) {}
}

export class ProfileGetInfoSuccessAction implements Action {
    readonly type = GET_PROFILE_INFO_SUCCESS_ACTION_TYPE
    constructor(public payload: { profile: IUser }) {}
}

/*  CONNECTIONS  */

export class ProfileSendConnectionAction implements Action {
    readonly type = SEND_CONNECTION_ACTION_TYPE
    constructor(
        public payload: {
            senderId: number
            userId: number
            message: string
        },
    ) {}
}

export class ProfileAcceptConnectionAction implements Action {
    readonly type = ACCEPT_CONNECTION_ACTION_TYPE
    constructor(
        public payload: {
            senderId: number
            userId: number
            date: number
        },
    ) {}
}

export class ProfileDeclineConnectionAction implements Action {
    readonly type = DECLINE_CONNECTION_ACTION_TYPE
    constructor(
        public payload: {
            senderId: number
            userId: number
        },
    ) {}
}

export class ProfileRemoveConnectionAction implements Action {
    readonly type = REMOVE_CONNECTION_ACTION_TYPE
    constructor(
        public payload: {
            senderId: number
            userId: number
        },
    ) {}
}

export class ProfileSendConnectionSuccessAction implements Action {
    readonly type = SEND_CONNECTION_SUCCESS_ACTION_TYPE
    constructor(
        public payload: {
            senderId: number
        },
    ) {}
}

export class ProfileAcceptConnectionSuccessAction implements Action {
    readonly type = ACCEPT_CONNECTION_SUCCESS_ACTION_TYPE
    constructor(
        public payload: {
            userId: number
            date: number
        },
    ) {}
}

export class ProfileDeclineConnectionSuccessAction implements Action {
    readonly type = DECLINE_CONNECTION_SUCCESS_ACTION_TYPE
    constructor(
        public payload: {
            senderId: number
        },
    ) {}
}

export class ProfileRemoveConnectionSuccessAction implements Action {
    readonly type = REMOVE_CONNECTION_SUCCESS_ACTION_TYPE
    constructor(
        public payload: {
            senderId: number
        },
    ) {}
}

export type ProfileActions =
    | ProfileGetInfoAction
    | ProfileGetInfoSuccessAction
    | ProfileSendConnectionAction
    | ProfileSendConnectionSuccessAction
    | ProfileAcceptConnectionAction
    | ProfileAcceptConnectionSuccessAction
    | ProfileDeclineConnectionAction
    | ProfileDeclineConnectionSuccessAction
    | ProfileRemoveConnectionAction
    | ProfileRemoveConnectionSuccessAction
