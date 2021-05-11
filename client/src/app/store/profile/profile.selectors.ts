import { createFeatureSelector, createSelector } from '@ngrx/store'
import { profileNode, ProfileState } from './profile.reducer'

export const profileFeatureSelector = createFeatureSelector<ProfileState>(
    profileNode,
)

export const profileSelector = createSelector(
    profileFeatureSelector,
    state => state,
)

export const profileIdSelector = createSelector(
    profileFeatureSelector,
    state => state.id,
)

export const profileNameSelector = createSelector(
    profileFeatureSelector,
    state => `${state.firstName} ${state.lastName}`,
)

export const profilePhoneSelector = createSelector(
    profileFeatureSelector,
    state => state.phone,
)

export const profileEmailSelector = createSelector(
    profileFeatureSelector,
    state => state.email,
)

export const profilePostsSelector = createSelector(
    profileFeatureSelector,
    state => state.info.posts,
)

export const profileConnectionsSelector = createSelector(
    profileFeatureSelector,
    state => state.info.connections,
)

export const profileCurrentViewsSelector = createSelector(
    profileFeatureSelector,
    state => state.info.views.current,
)

export const profilePrevViewsSelector = createSelector(
    profileFeatureSelector,
    state => state.info.views.prev,
)

export const profileAvatarSelector = createSelector(
    profileFeatureSelector,
    state => state.info.avatar?.url ?? '../../../assets/img/avatar-man.png',
)

export const profileHeaderBgSelector = createSelector(
    profileFeatureSelector,
    state =>
        state.info.profileHeaderBg?.url ??
        '../../../assets/img/profile-header.png',
)

export const profileDescriptionSelector = createSelector(
    profileFeatureSelector,
    state => state.info.description,
)

export const profileProfessionSelector = createSelector(
    profileFeatureSelector,
    state => state.info.profession,
)

export const profileDOBSelector = createSelector(
    profileFeatureSelector,
    state => state.info.dateOfBirth,
)

export const profileLocalitySelector = createSelector(
    profileFeatureSelector,
    state => {
        const locality = state.info.locality
        return `${locality.city}, ${locality.country}`
    },
)

export const profileSentConnectionsSelector = createSelector(
    profileFeatureSelector,
    state => state.info.sentConnections,
)
