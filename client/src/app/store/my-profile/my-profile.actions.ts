/* ACTION TYPES */
import { Action } from '@ngrx/store'
import { MyProfileState } from './my-profile.reducer'
import { IUser } from '../../interfaces/user'
import { IContact } from '../../interfaces/contact'
import { IProject } from '../../interfaces/project'
import { IUniversity } from '../../interfaces/university'
import { IExp } from '../../interfaces/exp'

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

export const REMOVE_CONNECTION_ACTION_TYPE = '[MY PROFILE] remove connection'
export const REMOVE_CONNECTION_SUCCESS_ACTION_TYPE =
    '[MY PROFILE] remove connection success'

export const CHANGE_AVATAR_ACTION_TYPE = '[MY PROFILE] change avatar'
export const CHANGE_AVATAR_SUCCESS_ACTION_TYPE =
    '[MY PROFILE] change avatar success'

export const DELETE_AVATAR_SUCCESS_ACTION_TYPE =
    '[MY PROFILE] delete avatar success'

// change additional information action types

export const CHANGE_ROLE_ACTION_TYPE = '[MY PROFILE] change role'
export const CHANGE_ROLE_SUCCESS_ACTION_TYPE =
    '[MY PROFILE] change role success'
export const CHANGE_COMPANY_ACTION_TYPE = '[MY PROFILE] change company'
export const CHANGE_COMPANY_SUCCESS_ACTION_TYPE =
    '[MY PROFILE] change company success'
export const CHANGE_ABOUT_ACTION_TYPE = '[MY PROFILE] change about'
export const CHANGE_ABOUT_SUCCESS_ACTION_TYPE =
    '[MY PROFILE] change about success'
export const CHANGE_PROFESSION_ACTION_TYPE = '[MY PROFILE] change profession'
export const CHANGE_PROFESSION_SUCCESS_ACTION_TYPE =
    '[MY PROFILE] change profession success'
export const CHANGE_LOCALITY_ACTION_TYPE = '[MY PROFILE] change locality'
export const CHANGE_LOCALITY_SUCCESS_ACTION_TYPE =
    '[MY PROFILE] change locality success'
export const CHANGE_CONTACT_INFO_ACTION_TYPE =
    '[MY PROFILE] change contact info'
export const CHANGE_CONTACT_INFO_SUCCESS_ACTION_TYPE =
    '[MY PROFILE] change contact info success'
export const CHANGE_PROJECTS_ACTION_TYPE = '[MY PROFILE] change projects'
export const CHANGE_PROJECTS_SUCCESS_ACTION_TYPE =
    '[MY PROFILE] change projects success'
export const CHANGE_EXPERIENCE_ACTION_TYPE = '[MY PROFILE] change experience'
export const CHANGE_EXPERIENCE_SUCCESS_ACTION_TYPE =
    '[MY PROFILE] change experience success'
export const CHANGE_EDUCATION_ACTION_TYPE = '[MY PROFILE] change education'
export const CHANGE_EDUCATION_SUCCESS_ACTION_TYPE =
    '[MY PROFILE] change education success'

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

export class MyProfileRemoveConnectionAction implements Action {
    readonly type = REMOVE_CONNECTION_ACTION_TYPE
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
            senderId: number
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

export class MyProfileRemoveConnectionSuccessAction implements Action {
    readonly type = REMOVE_CONNECTION_SUCCESS_ACTION_TYPE
    constructor(
        public payload: {
            userId: number
        },
    ) {}
}

export class MyProfileChangeAvatarAction implements Action {
    readonly type = CHANGE_AVATAR_ACTION_TYPE
    constructor(
        public payload: {
            file: File
        },
    ) {}
}

export class MyProfileChangeAvatarSuccessAction implements Action {
    readonly type = CHANGE_AVATAR_SUCCESS_ACTION_TYPE
    constructor(
        public payload: {
            url: string
        },
    ) {}
}

export class MyProfileDeleteAvatarSuccessAction implements Action {
    readonly type = DELETE_AVATAR_SUCCESS_ACTION_TYPE
}

export class MyProfileChangeRoleAction implements Action {
    readonly type = CHANGE_ROLE_ACTION_TYPE
    constructor(
        public payload: {
            role: string
            id: number
        },
    ) {}
}

export class MyProfileChangeRoleSuccessAction implements Action {
    readonly type = CHANGE_ROLE_SUCCESS_ACTION_TYPE
    constructor(
        public payload: {
            role: string
        },
    ) {}
}

export class MyProfileChangeCompanyAction implements Action {
    readonly type = CHANGE_COMPANY_ACTION_TYPE
    constructor(
        public payload: {
            id: number
        },
    ) {}
}

export class MyProfileChangeCompanySuccessAction implements Action {
    readonly type = CHANGE_COMPANY_SUCCESS_ACTION_TYPE
    constructor(public payload: {}) {}
}

export class MyProfileChangeAboutAction implements Action {
    readonly type = CHANGE_ABOUT_ACTION_TYPE
    constructor(
        public payload: {
            about: string
            id: number
        },
    ) {}
}

export class MyProfileChangeAboutSuccessAction implements Action {
    readonly type = CHANGE_ABOUT_SUCCESS_ACTION_TYPE
    constructor(
        public payload: {
            about: string
        },
    ) {}
}

export class MyProfileChangeProfessionAction implements Action {
    readonly type = CHANGE_PROFESSION_ACTION_TYPE
    constructor(
        public payload: {
            profession: string
            id: number
        },
    ) {}
}

export class MyProfileChangeProfessionSuccessAction implements Action {
    readonly type = CHANGE_PROFESSION_SUCCESS_ACTION_TYPE
    constructor(
        public payload: {
            profession: string
        },
    ) {}
}

export class MyProfileChangeLocalityAction implements Action {
    readonly type = CHANGE_LOCALITY_ACTION_TYPE
    constructor(
        public payload: {
            locality: { country: string; city: string }
            id: number
        },
    ) {}
}

export class MyProfileChangeLocalitySuccessAction implements Action {
    readonly type = CHANGE_LOCALITY_SUCCESS_ACTION_TYPE
    constructor(
        public payload: {
            locality: { country: string; city: string }
        },
    ) {}
}

export class MyProfileChangeContactInfoAction implements Action {
    readonly type = CHANGE_CONTACT_INFO_ACTION_TYPE
    constructor(
        public payload: {
            contactInfo: IContact[]
            id: number
        },
    ) {}
}

export class MyProfileChangeContactInfoSuccessAction implements Action {
    readonly type = CHANGE_CONTACT_INFO_SUCCESS_ACTION_TYPE
    constructor(
        public payload: {
            contactInfo: IContact[]
        },
    ) {}
}

export class MyProfileChangeProjectsAction implements Action {
    readonly type = CHANGE_PROJECTS_ACTION_TYPE
    constructor(
        public payload: {
            projects: IProject[]
            id: number
        },
    ) {}
}

export class MyProfileChangeProjectsSuccessAction implements Action {
    readonly type = CHANGE_PROJECTS_SUCCESS_ACTION_TYPE
    constructor(
        public payload: {
            projects: IProject[]
        },
    ) {}
}

export class MyProfileChangeExperienceAction implements Action {
    readonly type = CHANGE_EXPERIENCE_ACTION_TYPE
    constructor(
        public payload: {
            experience: IExp[]
            id: number
        },
    ) {}
}

export class MyProfileChangeExperienceSuccessAction implements Action {
    readonly type = CHANGE_EXPERIENCE_SUCCESS_ACTION_TYPE
    constructor(
        public payload: {
            experience: IExp[]
        },
    ) {}
}

export class MyProfileChangeEducationAction implements Action {
    readonly type = CHANGE_EDUCATION_ACTION_TYPE
    constructor(
        public payload: {
            education: IUniversity[]
            id: number
        },
    ) {}
}

export class MyProfileChangeEducationSuccessAction implements Action {
    readonly type = CHANGE_EDUCATION_SUCCESS_ACTION_TYPE
    constructor(
        public payload: {
            education: IUniversity[]
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
    | MyProfileRemoveConnectionAction
    | MyProfileRemoveConnectionSuccessAction
    | MyProfileChangeAvatarAction
    | MyProfileChangeAvatarSuccessAction
    | MyProfileDeleteAvatarSuccessAction
    | MyProfileChangeRoleAction
    | MyProfileChangeRoleSuccessAction
    | MyProfileChangeCompanyAction
    | MyProfileChangeCompanySuccessAction
    | MyProfileChangeAboutAction
    | MyProfileChangeAboutSuccessAction
    | MyProfileChangeProfessionAction
    | MyProfileChangeProfessionSuccessAction
    | MyProfileChangeLocalityAction
    | MyProfileChangeLocalitySuccessAction
    | MyProfileChangeContactInfoAction
    | MyProfileChangeContactInfoSuccessAction
    | MyProfileChangeProjectsAction
    | MyProfileChangeProjectsSuccessAction
    | MyProfileChangeExperienceAction
    | MyProfileChangeExperienceSuccessAction
    | MyProfileChangeEducationAction
    | MyProfileChangeEducationSuccessAction
