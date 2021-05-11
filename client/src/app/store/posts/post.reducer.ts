import {
    COMMENT_CREATE_FAILED_ACTION_TYPE,
    COMMENT_CREATE_SUCCESS_ACTION_TYPE,
    POST_COMMENTS_CLOSE_ACTION_TYPE,
    POST_COMMENTS_OPEN_ACTION_TYPE,
    POST_CREATE_FAILED_ACTION_TYPE,
    POST_CREATE_SUCCESS_ACTION_TYPE,
    POST_DONT_LIKE_FAILED_ACTION_TYPE,
    POST_DONT_LIKE_SUCCESS_ACTION_TYPE,
    POST_EDIT_FAILED_ACTION_TYPE,
    POST_EDIT_SUCCESS_ACTION_TYPE,
    POST_GET_FAILED_ACTION_TYPE,
    POST_GET_SUCCESS_ACTION_TYPE,
    POST_LIKE_FAILED_ACTION_TYPE,
    POST_LIKE_SUCCESS_ACTION_TYPE,
    PostActions,
} from './post.actions'
import { IPost } from '../../interfaces/post/post'
import { IComment } from '../../interfaces/post/comment'

export const postNode = 'post'

export interface PostState {
    posts: IPost[]
    error: string
}

const initialState: PostState = {
    posts: [],
    error: '',
}

export const postReducer = (
    state: PostState = initialState,
    action: PostActions,
) => {
    switch (action.type) {
        case POST_CREATE_SUCCESS_ACTION_TYPE:
            return {
                ...state,
                posts: [action.payload.post, ...state.posts],
            }
        case POST_CREATE_FAILED_ACTION_TYPE:
            return {
                ...state,
                error: action.payload.err,
            }
        case POST_EDIT_SUCCESS_ACTION_TYPE:
            return {
                ...state,
            }
        case POST_EDIT_FAILED_ACTION_TYPE:
            return {
                ...state,
                error: action.payload.err,
            }
        case POST_LIKE_SUCCESS_ACTION_TYPE:
            return {
                ...state,
                posts: state.posts.map(post => {
                    if (action.payload.postId === post.id) {
                        return {
                            ...post,
                            likes: [
                                ...post.likes,
                                { userId: action.payload.userId },
                            ],
                        }
                    }
                    return post
                }),
            }
        case POST_LIKE_FAILED_ACTION_TYPE:
            return {
                ...state,
                error: action.payload.err,
            }
        case POST_DONT_LIKE_SUCCESS_ACTION_TYPE:
            return {
                ...state,
                posts: state.posts.map(post => {
                    if (action.payload.postId === post.id) {
                        return {
                            ...post,
                            likes: post.likes.filter(
                                user => user.userId !== action.payload.userId,
                            ),
                        }
                    }
                    return post
                }),
            }
        case POST_DONT_LIKE_FAILED_ACTION_TYPE:
            return {
                ...state,
                // error: action.payload.err
            }
        case POST_GET_SUCCESS_ACTION_TYPE:
            return {
                ...state,
                posts: action.payload.posts,
            }
        case POST_GET_FAILED_ACTION_TYPE:
            return {
                ...state,
                error: action.payload.err,
            }
        case POST_COMMENTS_OPEN_ACTION_TYPE:
            return {
                ...state,
                posts: state.posts.map(post => {
                    if (post.id === action.payload.postId) {
                        return {
                            ...post,
                            commentsOpen: true,
                        }
                    }
                    return post
                }),
            }
        case POST_COMMENTS_CLOSE_ACTION_TYPE:
            return {
                ...state,
                posts: state.posts.map(post => {
                    if (post.id === action.payload.postId) {
                        return {
                            ...post,
                            commentsOpen: false,
                        }
                    }
                    return post
                }),
            }
        case COMMENT_CREATE_SUCCESS_ACTION_TYPE:
            const payload = action.payload as {
                postId: number
                comments: IComment[]
            }
            return {
                ...state,
                posts: state.posts.map(post => {
                    if (post.id === payload.postId)
                        return {
                            ...post,
                            comments: payload.comments,
                        }
                    return post
                }),
            }
        case COMMENT_CREATE_FAILED_ACTION_TYPE:

        default:
            return state
    }
}
