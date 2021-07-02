import {
    ACCEPT_CONNECTION_SUCCESS_ACTION_TYPE,
    CANCEL_CONNECTION_SUCCESS_ACTION_TYPE,
    CHANGE_ABOUT_SUCCESS_ACTION_TYPE,
    CHANGE_AVATAR_SUCCESS_ACTION_TYPE,
    CHANGE_CONTACT_INFO_SUCCESS_ACTION_TYPE,
    CHANGE_EDUCATION_SUCCESS_ACTION_TYPE,
    CHANGE_EXPERIENCE_SUCCESS_ACTION_TYPE,
    CHANGE_LOCALITY_SUCCESS_ACTION_TYPE,
    CHANGE_PROFESSION_SUCCESS_ACTION_TYPE,
    CHANGE_PROJECTS_SUCCESS_ACTION_TYPE,
    CHANGE_ROLE_SUCCESS_ACTION_TYPE,
    DECLINE_CONNECTION_SUCCESS_ACTION_TYPE,
    DELETE_AVATAR_SUCCESS_ACTION_TYPE,
    GET_MY_PROFILE_INFO_SUCCESS_ACTION_TYPE,
    MyProfileActions,
    REMOVE_CONNECTION_SUCCESS_ACTION_TYPE,
} from './my-profile.actions'
import { IFile } from '../../interfaces/file'
import { IContact } from '../../interfaces/contact'
import { IProject } from '../../interfaces/project'
import { IExp } from '../../interfaces/exp'
import { IUniversity } from '../../interfaces/university'

export const myProfileNode = 'my profile'

export interface MyProfileState {
    id: number

    firstName: string
    lastName: string
    email: string
    phone: string
    password: string

    info: {
        isOnline: boolean
        role: string
        description: string
        about: string
        views: {
            current: number
            prev: number
        }
        connections: { userId: number; date: number }[]
        sentConnections: { userId: number; message: string }[]
        receivedConnections: { userId: number; message: string }[]
        posts: {
            postId: number
        }[]
        avatar: IFile | null
        profileHeaderBg: IFile | null
        dateOfBirth: number
        gender: string
        profession: string
        locality: {
            country: string
            city: string
        }
        contactInfo: IContact[]
        projects: IProject[]
        experience: IExp[]
        education: IUniversity[]
        dateOfLastPasswordUpdate: number
    }
}

const initialState: MyProfileState = {
    id: -1,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',

    info: {
        isOnline: false,
        role: '',
        description: '',
        about: '',
        views: {
            current: 0,
            prev: 0,
        },
        connections: [],
        sentConnections: [],
        receivedConnections: [],
        posts: [],
        avatar: null,
        profileHeaderBg: null,
        dateOfBirth: 0,
        gender: '',
        profession: '',
        locality: {
            country: '',
            city: '',
        },
        contactInfo: [],
        projects: [],
        experience: [],
        education: [],
        dateOfLastPasswordUpdate: 0,
    },
}

export const myProfileReducer = (
    state: MyProfileState = initialState,
    action: MyProfileActions,
) => {
    switch (action.type) {
        case GET_MY_PROFILE_INFO_SUCCESS_ACTION_TYPE:
            return action.payload.profile
        case ACCEPT_CONNECTION_SUCCESS_ACTION_TYPE:
            console.log(action.payload)
            return {
                ...state,
                info: {
                    ...state.info,
                    connections: [
                        ...state.info.connections,
                        {
                            userId: action.payload.senderId,
                            date: action.payload.date,
                        },
                    ],
                    receivedConnections: [],
                },
            }
        case DECLINE_CONNECTION_SUCCESS_ACTION_TYPE:
            return {
                ...state,
                info: {
                    ...state.info,
                    receivedConnections: state.info.receivedConnections.filter(
                        user => user.userId !== action.payload.senderId,
                    ),
                },
            }
        case CANCEL_CONNECTION_SUCCESS_ACTION_TYPE:
            return {
                ...state,
                info: {
                    ...state.info,
                    sentConnections: state.info.sentConnections.filter(
                        user => user.userId !== action.payload.userId,
                    ),
                },
            }
        case REMOVE_CONNECTION_SUCCESS_ACTION_TYPE:
            return {
                ...state,
                info: {
                    ...state.info,
                    connections: state.info.connections.filter(
                        user => user.userId !== action.payload.userId,
                    ),
                },
            }
        case CHANGE_AVATAR_SUCCESS_ACTION_TYPE:
            return {
                ...state,
                info: {
                    ...state.info,
                    avatar: {
                        ...state.info.avatar,
                        url: action.payload.url,
                    },
                },
            }
        case DELETE_AVATAR_SUCCESS_ACTION_TYPE:
            return {
                ...state,
                info: {
                    ...state.info,
                    avatar: null,
                },
            }
        case CHANGE_ROLE_SUCCESS_ACTION_TYPE:
            return {
                ...state,
                info: {
                    ...state.info,
                    role: action.payload.role,
                },
            }
        case CHANGE_ABOUT_SUCCESS_ACTION_TYPE:
            return {
                ...state,
                info: {
                    ...state.info,
                    about: action.payload.about,
                },
            }
        case CHANGE_PROFESSION_SUCCESS_ACTION_TYPE:
            return {
                ...state,
                info: {
                    ...state.info,
                    profession: action.payload.profession,
                },
            }
        case CHANGE_LOCALITY_SUCCESS_ACTION_TYPE:
            return {
                ...state,
                info: {
                    ...state.info,
                    locality: action.payload.locality,
                },
            }
        case CHANGE_CONTACT_INFO_SUCCESS_ACTION_TYPE:
            return {
                ...state,
                info: {
                    ...state.info,
                    contactInfo: action.payload.contactInfo,
                },
            }
        case CHANGE_PROJECTS_SUCCESS_ACTION_TYPE:
            return {
                ...state,
                info: {
                    ...state.info,
                    projects: action.payload.projects,
                },
            }
        case CHANGE_EXPERIENCE_SUCCESS_ACTION_TYPE:
            return {
                ...state,
                info: {
                    ...state.info,
                    experience: action.payload.experience,
                },
            }
        case CHANGE_EDUCATION_SUCCESS_ACTION_TYPE:
            return {
                ...state,
                info: {
                    ...state.info,
                    education: action.payload.education,
                },
            }
        default:
            return state
    }
}
