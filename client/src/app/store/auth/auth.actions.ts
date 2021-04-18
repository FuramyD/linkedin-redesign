import { Action } from '@ngrx/store'

/* ACTION TYPES */
export const SIGN_IN_ACTION_TYPE: string = '[AUTH] sign in'
export const SIGN_IN_SUCCESS_ACTION_TYPE: string = '[AUTH] sign in success'
export const SIGN_IN_FAILED_ACTION_TYPE: string = '[AUTH] sign in failed'

export const LOG_OUT_ACTION_TYPE: string = '[AUTH] log out'
export const LOG_OUT_SUCCESS_ACTION_TYPE: string = '[AUTH] log out success'
export const LOG_OUT_FAILED_ACTION_TYPE: string = '[AUTH] log out failed'

/* ACTIONS */
export class SignInAction implements Action {
    readonly type = SIGN_IN_ACTION_TYPE
}

export class LogOutAction implements Action {
    readonly type = LOG_OUT_ACTION_TYPE
}

export type AuthActions = SignInAction | LogOutAction
