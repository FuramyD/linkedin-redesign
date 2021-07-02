import { Action, ActionReducerMap, MetaReducer } from '@ngrx/store'
import { environment } from '../../environments/environment'
import { authNode, authReducer, AuthState } from './auth/auth.reducer'
import { postNode, postReducer, PostState } from './posts/post.reducer'
import {
    myProfileNode,
    myProfileReducer,
    MyProfileState,
} from './my-profile/my-profile.reducer'
import {
    profileNode,
    profileReducer,
    ProfileState,
} from './profile/profile.reducer'
import {
    findUsersNode,
    findUsersReducer,
    FindUsersState,
} from './my-profile/find-users/find-users.reducer'
import { chatNode, chatReducer, ChatState } from './chat/chat.reducer'

export interface State {
    [authNode]: AuthState
    [chatNode]: ChatState
    [myProfileNode]: MyProfileState
    [postNode]: PostState
    [profileNode]: ProfileState
    [findUsersNode]: FindUsersState
}

export const reducers: ActionReducerMap<State> = {
    [authNode]: authReducer,
    // @ts-ignore
    [chatNode]: chatReducer,
    // @ts-ignore
    [postNode]: postReducer,
    // @ts-ignore
    [myProfileNode]: myProfileReducer,
    // @ts-ignore
    [profileNode]: profileReducer,
    // @ts-ignore
    [findUsersNode]: findUsersReducer,
}

export const metaReducers: MetaReducer<State>[] = !environment.production
    ? []
    : []
