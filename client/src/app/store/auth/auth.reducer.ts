import {
    AuthActions,
    LOG_OUT_ACTION_TYPE,
    SIGN_IN_ACTION_TYPE,
} from './auth.actions'

export const authNode = 'auth'

export interface AuthState {
    authStatus: boolean
}

const initialState: AuthState = {
    authStatus: false,
}

export const authReducer = (state = initialState, action: AuthActions) => {
    switch (action.type) {
        case SIGN_IN_ACTION_TYPE:
            return {
                ...state,
                authStatus: true,
            }
        case LOG_OUT_ACTION_TYPE:
            return {
                ...state,
                authStatus: false,
            }
        default:
            return state
    }
}
