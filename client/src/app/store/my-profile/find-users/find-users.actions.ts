import { Action } from '@ngrx/store'
import { IUser } from '../../../interfaces/user'

export const FIND_USERS_BY_FULL_NAME_ACTION_TYPE =
    '[FIND USERS] find users by full name'
export const FIND_USERS_BY_FULL_NAME_SUCCESS_ACTION_TYPE =
    '[FIND USERS] users by full name is found'

export class FindUsersByFullNameAction implements Action {
    readonly type = FIND_USERS_BY_FULL_NAME_ACTION_TYPE
    constructor(
        public payload: {
            fullName: string
        },
    ) {}
}

export class FindUsersByFullNameSuccessAction implements Action {
    readonly type = FIND_USERS_BY_FULL_NAME_SUCCESS_ACTION_TYPE
    constructor(
        public payload: {
            users: IUser[]
        },
    ) {}
}

export type FindUsersActions =
    | FindUsersByFullNameAction
    | FindUsersByFullNameSuccessAction
