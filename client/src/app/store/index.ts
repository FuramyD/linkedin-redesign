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

export interface State {
    [authNode]: AuthState
    [myProfileNode]: MyProfileState
    [postNode]: PostState
}

export const reducers: ActionReducerMap<State> = {
    [authNode]: authReducer,
    // @ts-ignore
    [postNode]: postReducer,
    // @ts-ignore
    [myProfileNode]: myProfileReducer,
    [profileNode]: profileReducer,
}

export const metaReducers: MetaReducer<State>[] = !environment.production
    ? []
    : []
