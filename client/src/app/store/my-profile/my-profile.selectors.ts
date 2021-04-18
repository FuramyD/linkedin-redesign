import { createFeatureSelector, createSelector } from '@ngrx/store'
import { myProfileNode, MyProfileState } from './my-profile.reducer'

export const myProfileFeatureSelector = createFeatureSelector<MyProfileState>(
    myProfileNode,
)

export const myProfileSelector = createSelector(
    myProfileFeatureSelector,
    state => state,
)

export const myProfileIdSelector = createSelector(
    myProfileFeatureSelector,
    state => state.id,
)

export const myProfileNameSelector = createSelector(
    myProfileFeatureSelector,
    state => ({
        firstName: state.firstName,
        lastName: state.lastName,
    }),
)

export const myProfilePhoneSelector = createSelector(
    myProfileFeatureSelector,
    state => state.phone,
)

export const myProfileEmailSelector = createSelector(
    myProfileFeatureSelector,
    state => state.email,
)

export const myProfilePostsSelector = createSelector(
    myProfileFeatureSelector,
    state => state.info.posts,
)

export const myProfileCurrentViewsSelector = createSelector(
    myProfileFeatureSelector,
    state => state.info.views.current,
)

export const myProfilePrevViewsSelector = createSelector(
    myProfileFeatureSelector,
    state => state.info.views.prev,
)

export const myProfileAvatarSelector = createSelector(
    myProfileFeatureSelector,
    state => state.info.avatar || '../../../assets/img/avatar-man.png',
)

export const myProfileDescriptionSelector = createSelector(
    myProfileFeatureSelector,
    state => state.info.description,
)

export const myProfileDOBSelector = createSelector(
    myProfileFeatureSelector,
    state => state.info.dateOfBirth,
)

export const myProfileSentConnectionsSelector = createSelector(
    myProfileFeatureSelector,
    state => state.info.sentConnections,
)

export const myProfileReceivedConnectionsSelector = createSelector(
    myProfileFeatureSelector,
    state => state.info.receivedConnections,
)

export const myProfileConnectionsSelector = createSelector(
    myProfileFeatureSelector,
    state => state.info.connections,
)
