import { createFeatureSelector, createSelector } from '@ngrx/store'
import { authNode, AuthState } from './auth.reducer'

export const authFeatureSelector = createFeatureSelector<AuthState>(authNode)

export const authStatusSelector = createSelector(
    authFeatureSelector,
    (state: AuthState) => state.authStatus,
)
