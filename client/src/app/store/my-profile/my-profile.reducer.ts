import {
    ACCEPT_CONNECTION_SUCCESS_ACTION_TYPE,
    CANCEL_CONNECTION_SUCCESS_ACTION_TYPE,
    DECLINE_CONNECTION_SUCCESS_ACTION_TYPE,
    GET_MY_PROFILE_INFO_SUCCESS_ACTION_TYPE,
    MyProfileActions,
} from './my-profile.actions'
import { IUser } from '../../interfaces/user'

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
        description: string
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
        avatar: string | ArrayBuffer | null
        profileHeaderBg: string | ArrayBuffer | null
        dateOfBirth: number
        profession: string
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
        description: '',
        views: {
            current: 0,
            prev: 0,
        },
        connections: [],
        sentConnections: [],
        receivedConnections: [],
        posts: [],
        avatar: '',
        profileHeaderBg: '',
        dateOfBirth: 0,
        profession: '',
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
        default:
            return state
    }
}
