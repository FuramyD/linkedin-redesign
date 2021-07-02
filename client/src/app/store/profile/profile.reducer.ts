import {
    ACCEPT_CONNECTION_SUCCESS_ACTION_TYPE,
    DECLINE_CONNECTION_SUCCESS_ACTION_TYPE,
    GET_PROFILE_INFO_SUCCESS_ACTION_TYPE,
    ProfileActions,
    REMOVE_CONNECTION_SUCCESS_ACTION_TYPE,
    SEND_CONNECTION_SUCCESS_ACTION_TYPE,
} from './profile.actions'
import { IFile } from '../../interfaces/file'
import {IContact} from "../../interfaces/contact";
import {IProject} from "../../interfaces/project";
import {IExp} from "../../interfaces/exp";
import {IUniversity} from "../../interfaces/university";

export const profileNode = 'profile'

export interface ProfileState {
    id: number

    firstName: string
    lastName: string
    email: string
    phone: string
    password: string

    info: {
        isOnline: boolean
        description: string
        views: {
            current: number
            prev: number
        }
        connections: { userId: number; date: number }[]
        sentConnections: { userId: number; message: string }[]
        receivedConnections: { userId: number /* message: string */ }[]
        posts: {
            postId: number
        }[]
        avatar: IFile | null
        profileHeaderBg: IFile | null
        dateOfBirth: number
        profession: string
        locality: {
            country: string
            city: string
        }
        contactInfo: IContact[]
        projects: IProject[]
        experience: IExp[]
        education: IUniversity[]
    }
}

const initialState: ProfileState = {
    id: -1,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',

    info: {
        isOnline: false,
        description: '',
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
        profession: '',
        locality: {
            country: '',
            city: '',
        },
        contactInfo: [],
        projects: [],
        experience: [],
        education: [],
    },
}

export const profileReducer = (
    state: ProfileState = initialState,
    action: ProfileActions,
) => {
    switch (action.type) {
        case GET_PROFILE_INFO_SUCCESS_ACTION_TYPE:
            return action.payload.profile
        case SEND_CONNECTION_SUCCESS_ACTION_TYPE:
            return {
                ...state,
                info: {
                    ...state.info,
                    receivedConnections: [
                        ...state.info.receivedConnections,
                        { userId: action.payload.senderId },
                    ],
                },
            }
        case ACCEPT_CONNECTION_SUCCESS_ACTION_TYPE:
            return {
                ...state,
                info: {
                    ...state.info,
                    connections: [
                        ...state.info.connections,
                        {
                            userId: action.payload.userId,
                            date: action.payload.date,
                        },
                    ],
                    sentConnections: state.info.sentConnections.filter(
                        user => user.userId !== action.payload.userId,
                    ),
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
        case REMOVE_CONNECTION_SUCCESS_ACTION_TYPE:
            return {
                ...state,
                info: {
                    ...state.info,
                    connections: state.info.connections.filter(
                        user => user.userId !== action.payload.senderId,
                    ),
                },
            }
        default:
            return state
    }
}
