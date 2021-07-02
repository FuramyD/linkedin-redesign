import { createFeatureSelector, createSelector } from '@ngrx/store'
import { findUsersNode, FindUsersState } from './find-users.reducer'

export const findUsersFeatureSelector = createFeatureSelector<FindUsersState>(
    findUsersNode,
)

export const otherUsersSelector = createSelector(
    findUsersFeatureSelector,
    state => state.users,
)
