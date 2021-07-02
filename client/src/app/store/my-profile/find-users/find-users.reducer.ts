import { IUser } from '../../../interfaces/user'
import {
    FIND_USERS_BY_FULL_NAME_SUCCESS_ACTION_TYPE,
    FindUsersActions,
} from './find-users.actions'

export const findUsersNode = 'find users'

export interface FindUsersState {
    users: IUser[]
}

const initialState = {
    users: [],
}

export const findUsersReducer = (
    state: FindUsersState,
    action: FindUsersActions,
) => {
    switch (action.type) {
        case FIND_USERS_BY_FULL_NAME_SUCCESS_ACTION_TYPE:
            return {
                ...state,
                users: action.payload.users,
            }
        default:
            return state
    }
}
