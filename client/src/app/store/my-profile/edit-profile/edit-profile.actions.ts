import { Action } from '@ngrx/store'

export const SET_SUCCESS_AD_ALERT_ACTION_TYPE =
    '[Edit Profile] Set success AD alert type'
export const SET_SUCCESS_LS_ALERT_ACTION_TYPE =
    '[Edit Profile] Set success LS alert type'
export const SET_ERROR_AD_ALERT_ACTION_TYPE =
    '[Edit Profile] Set error AD alert type'
export const SET_ERROR_LS_ALERT_ACTION_TYPE =
    '[Edit Profile] Set error LS alert type'

export class SetSuccessADAlert implements Action {
    readonly type = SET_SUCCESS_AD_ALERT_ACTION_TYPE
    constructor(
        public payload: {
            type: string
            content: string
        },
    ) {}
}

export class SetSuccessLSAlert implements Action {
    readonly type = SET_SUCCESS_LS_ALERT_ACTION_TYPE
    constructor(
        public payload: {
            type: string
            content: string
        },
    ) {}
}

export class SetErrorADAlert implements Action {
    readonly type = SET_ERROR_AD_ALERT_ACTION_TYPE
    constructor(
        public payload: {
            type: string
            content: string
        },
    ) {}
}

export class SetErrorLSAlert implements Action {
    readonly type = SET_ERROR_LS_ALERT_ACTION_TYPE
    constructor(
        public payload: {
            type: string
            content: string
        },
    ) {}
}

export type EditProfileActions =
    | SetSuccessADAlert
    | SetSuccessLSAlert
    | SetErrorADAlert
    | SetErrorLSAlert
