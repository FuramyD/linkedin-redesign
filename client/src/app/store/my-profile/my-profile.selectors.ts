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
    state => {
        return state.info.avatar?.url ?? '../../../assets/img/avatar-man.png'
    },
)

export const myProfileProfessionSelector = createSelector(
    myProfileFeatureSelector,
    state => state.info.profession,
)

export const myProfileRoleSelector = createSelector(
    myProfileFeatureSelector,
    state => state.info.role,
)

export const myProfileDescriptionSelector = createSelector(
    myProfileFeatureSelector,
    state => state.info.description,
)

export const myProfileAboutSelector = createSelector(
    myProfileFeatureSelector,
    state => state.info.about,
)

export const myProfileDOBSelector = createSelector(
    myProfileFeatureSelector,
    state => state.info.dateOfBirth,
)

export const myProfileLocalitySelector = createSelector(
    myProfileFeatureSelector,
    state => state.info.locality,
)

export const myProfileGenderSelector = createSelector(
    myProfileFeatureSelector,
    state => state.info.gender,
)

export const myProfileDateOfLastPasswordUpdateSelector = createSelector(
    myProfileFeatureSelector,
    state => state.info.dateOfLastPasswordUpdate,
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

export const myProfileContactInfoSelector = createSelector(
    myProfileFeatureSelector,
    state => state.info.contactInfo,
)

export const myProfileProjectsSelector = createSelector(
    myProfileFeatureSelector,
    state => state.info.projects,
)

export const myProfileExperienceSelector = createSelector(
    myProfileFeatureSelector,
    state => state.info.experience,
)

export const myProfileEducationSelector = createSelector(
    myProfileFeatureSelector,
    state => state.info.education,
)
