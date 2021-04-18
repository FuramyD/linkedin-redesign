import { createFeatureSelector, createSelector } from '@ngrx/store'
import { postNode, PostState } from './post.reducer'

export const postFeatureSelector = createFeatureSelector<PostState>(postNode)

export const postsSelector = createSelector(
    postFeatureSelector,
    (state: PostState) => {
        return state?.posts || []
    },
)

export const postsErrorSelector = createSelector(
    postFeatureSelector,
    state => state.error,
)
