import { Action } from '@ngrx/store'
import { PostDto } from '../../dto/post.dto'
import { IPost } from '../../interfaces/post/post'
import { CommentDto } from '../../dto/comment.dto'

/* TYPES */
/* POSTS TYPES */

export const POST_CREATE_ACTION_TYPE = '[POST] Create'
export const POST_CREATE_SUCCESS_ACTION_TYPE = '[POST] Create success'
export const POST_CREATE_FAILED_ACTION_TYPE = '[POST] Create failed'

export const POST_EDIT_ACTION_TYPE = '[POST] Edit'
export const POST_EDIT_SUCCESS_ACTION_TYPE = '[POST] Edit success'
export const POST_EDIT_FAILED_ACTION_TYPE = '[POST] Edit failed'

export const POST_GET_ACTION_TYPE = '[POST] Get'
export const POST_GET_SUCCESS_ACTION_TYPE = '[POST] Get success'
export const POST_GET_FAILED_ACTION_TYPE = '[POST] Get failed'

export const POST_REMOVE_ACTION_TYPE = '[POST] Remove'
export const POST_REMOVE_SUCCESS_ACTION_TYPE = '[POST] Remove success'
export const POST_REMOVE_FAILED_ACTION_TYPE = '[POST] Remove failed'

export const POST_LIKE_ACTION_TYPE = '[POST] Like'
export const POST_LIKE_SUCCESS_ACTION_TYPE = '[POST] Like success'
export const POST_LIKE_FAILED_ACTION_TYPE = '[POST] Like failed'

export const POST_DONT_LIKE_ACTION_TYPE = '[POST] Dont like'
export const POST_DONT_LIKE_SUCCESS_ACTION_TYPE = '[POST] Dont like success'
export const POST_DONT_LIKE_FAILED_ACTION_TYPE = '[POST] Dont like failed'

export const SORTING_POSTS_ACTION_TYPE = '[POST] sorting posts'

/* COMMENTS TYPES */

export const COMMENT_CREATE_ACTION_TYPE = '[COMMENT] Create'
export const COMMENT_CREATE_SUCCESS_ACTION_TYPE = '[COMMENT] Create success'
export const COMMENT_CREATE_FAILED_ACTION_TYPE = '[COMMENT] Create failed'

export const COMMENT_EDIT_ACTION_TYPE = '[COMMENT] Edit'
export const COMMENT_EDIT_SUCCESS_ACTION_TYPE = '[COMMENT] Edit success'
export const COMMENT_EDIT_FAILED_ACTION_TYPE = '[COMMENT] Edit failed'

export const COMMENT_GET_ACTION_TYPE = '[COMMENT] Get'
export const COMMENT_GET_SUCCESS_ACTION_TYPE = '[COMMENT] Get success'
export const COMMENT_GET_FAILED_ACTION_TYPE = '[COMMENT] Get failed'

export const COMMENT_REMOVE_ACTION_TYPE = '[COMMENT] Remove'
export const COMMENT_REMOVE_SUCCESS_ACTION_TYPE = '[COMMENT] Remove success'
export const COMMENT_REMOVE_FAILED_ACTION_TYPE = '[COMMENT] Remove failed'

export const COMMENT_LIKE_ACTION_TYPE = '[COMMENT] Like'
export const COMMENT_LIKE_SUCCESS_ACTION_TYPE = '[COMMENT] Like success'
export const COMMENT_LIKE_FAILED_ACTION_TYPE = '[COMMENT] Like failed'

export const COMMENT_DONT_LIKE_ACTION_TYPE = '[COMMENT] Dont like'
export const COMMENT_DONT_LIKE_SUCCESS_ACTION_TYPE =
    '[COMMENT] Dont like success'
export const COMMENT_DONT_LIKE_FAILED_ACTION_TYPE = '[COMMENT] Dont like failed'

export const POST_COMMENTS_OPEN_ACTION_TYPE = '[POST] Comments open'
export const POST_COMMENTS_CLOSE_ACTION_TYPE = '[POST] Comments close'

/* POSTS */

export class PostCreateAction implements Action {
    readonly type = POST_CREATE_ACTION_TYPE
    constructor(public payload: PostDto) {}
}

export class PostCreateSuccessAction implements Action {
    readonly type = POST_CREATE_SUCCESS_ACTION_TYPE
    constructor(
        public payload: {
            post: IPost
        },
    ) {}
}

export class PostCreateFailedAction implements Action {
    readonly type = POST_CREATE_FAILED_ACTION_TYPE
    constructor(
        public payload: {
            err: any
        },
    ) {}
}

export class PostEditAction implements Action {
    readonly type = POST_EDIT_ACTION_TYPE
}

export class PostEditSuccessAction implements Action {
    readonly type = POST_EDIT_SUCCESS_ACTION_TYPE
    constructor(public payload: {}) {}
}

export class PostEditFailedAction implements Action {
    readonly type = POST_EDIT_FAILED_ACTION_TYPE
    constructor(
        public payload: {
            err: any
        },
    ) {}
}

export class PostGetAction implements Action {
    readonly type = POST_GET_ACTION_TYPE
    constructor(
        public payload: {
            id: string | number
        },
    ) {}
}

export class PostGetSuccessAction implements Action {
    readonly type = POST_GET_SUCCESS_ACTION_TYPE
    constructor(
        public payload: {
            posts: IPost[]
        },
    ) {}
}

export class PostGetFailedAction implements Action {
    readonly type = POST_GET_FAILED_ACTION_TYPE
    constructor(
        public payload: {
            err: any
        },
    ) {}
}

export class PostRemoveAction implements Action {
    readonly type = POST_REMOVE_ACTION_TYPE
}

export class PostRemoveSuccessAction implements Action {
    readonly type = POST_REMOVE_SUCCESS_ACTION_TYPE
    constructor(public payload: {}) {}
}

export class PostRemoveFailedAction implements Action {
    readonly type = POST_REMOVE_FAILED_ACTION_TYPE
    constructor(
        public payload: {
            err: any
        },
    ) {}
}

export class PostLikeAction implements Action {
    readonly type = POST_LIKE_ACTION_TYPE
    constructor(
        public payload: {
            postId: number
            userId: number
        },
    ) {}
}

export class PostLikeSuccessAction implements Action {
    readonly type = POST_LIKE_SUCCESS_ACTION_TYPE
    constructor(
        public payload: {
            postId: number
            userId: number
        },
    ) {}
}

export class PostLikeFailedAction implements Action {
    readonly type = POST_LIKE_FAILED_ACTION_TYPE
    constructor(
        public payload: {
            err: any
        },
    ) {}
}

export class PostDontLikeAction implements Action {
    readonly type = POST_DONT_LIKE_ACTION_TYPE
    constructor(
        public payload: {
            postId: number
            userId: number
        },
    ) {}
}

export class PostDontLikeSuccessAction implements Action {
    readonly type = POST_DONT_LIKE_SUCCESS_ACTION_TYPE
    constructor(
        public payload: {
            postId: number
            userId: number
        },
    ) {}
}

export class PostDontLikeFailedAction implements Action {
    readonly type = POST_DONT_LIKE_FAILED_ACTION_TYPE
    constructor(
        public payload: {
            err: any
        },
    ) {}
}

export class PostCommentsOpenAction implements Action {
    readonly type = POST_COMMENTS_OPEN_ACTION_TYPE
    constructor(
        public payload: {
            postId: number
        },
    ) {}
}
export class PostCommentsCloseAction implements Action {
    readonly type = POST_COMMENTS_CLOSE_ACTION_TYPE
    constructor(
        public payload: {
            postId: number
        },
    ) {}
}

export class SortingPostsAction implements Action {
    readonly type = SORTING_POSTS_ACTION_TYPE
    constructor(public payload: { sortType: string }) {}
}

/* COMMENTS */

export class CommentCreateAction implements Action {
    readonly type = COMMENT_CREATE_ACTION_TYPE
    constructor(
        public payload: {
            postId: number
            commentInfo: CommentDto
        },
    ) {}
}

export class CommentCreateSuccessAction implements Action {
    readonly type = COMMENT_CREATE_SUCCESS_ACTION_TYPE
    constructor(public payload: {}) {}
}

export class CommentCreateFailedAction implements Action {
    readonly type = COMMENT_CREATE_FAILED_ACTION_TYPE
    constructor(
        public payload: {
            err: any
        },
    ) {}
}

export class CommentEditAction implements Action {
    readonly type = COMMENT_EDIT_ACTION_TYPE
}

export class CommentEditSuccessAction implements Action {
    readonly type = COMMENT_EDIT_SUCCESS_ACTION_TYPE
    constructor(public payload: {}) {}
}

export class CommentEditFailedAction implements Action {
    readonly type = COMMENT_EDIT_FAILED_ACTION_TYPE
    constructor(
        public payload: {
            err: any
        },
    ) {}
}

export class CommentGetAction implements Action {
    readonly type = COMMENT_GET_ACTION_TYPE
    constructor(payload: { id: string | number }) {}
}

export class CommentGetSuccessAction implements Action {
    readonly type = COMMENT_GET_SUCCESS_ACTION_TYPE
    constructor(public payload: {}) {}
}

export class CommentGetFailedAction implements Action {
    readonly type = COMMENT_GET_FAILED_ACTION_TYPE
    constructor(
        public payload: {
            err: any
        },
    ) {}
}

export class CommentRemoveAction implements Action {
    readonly type = COMMENT_REMOVE_ACTION_TYPE
}

export class CommentRemoveSuccessAction implements Action {
    readonly type = COMMENT_REMOVE_SUCCESS_ACTION_TYPE
    constructor(public payload: {}) {}
}

export class CommentRemoveFailedAction implements Action {
    readonly type = COMMENT_REMOVE_FAILED_ACTION_TYPE
    constructor(
        public payload: {
            err: any
        },
    ) {}
}

export class CommentLikeAction implements Action {
    readonly type = COMMENT_LIKE_ACTION_TYPE
}

export class CommentLikeSuccessAction implements Action {
    readonly type = COMMENT_LIKE_SUCCESS_ACTION_TYPE
    constructor(public payload: {}) {}
}

export class CommentLikeFailedAction implements Action {
    readonly type = COMMENT_LIKE_FAILED_ACTION_TYPE
    constructor(
        public payload: {
            err: any
        },
    ) {}
}

export class CommentDontLikeAction implements Action {
    readonly type = COMMENT_DONT_LIKE_ACTION_TYPE
}

export class CommentDontLikeSuccessAction implements Action {
    readonly type = COMMENT_DONT_LIKE_SUCCESS_ACTION_TYPE
    constructor(public payload: {}) {}
}

export class CommentDontLikeFailedAction implements Action {
    readonly type = COMMENT_DONT_LIKE_FAILED_ACTION_TYPE
    constructor(
        public payload: {
            err: any
        },
    ) {}
}

export type PostActions =
    | PostCreateSuccessAction
    | PostCreateFailedAction
    | PostEditSuccessAction
    | PostEditFailedAction
    | PostGetSuccessAction
    | PostGetFailedAction
    | PostRemoveSuccessAction
    | PostRemoveFailedAction
    | PostLikeSuccessAction
    | PostLikeFailedAction
    | PostDontLikeSuccessAction
    | PostDontLikeFailedAction
    | PostCommentsOpenAction
    | PostCommentsCloseAction
    | SortingPostsAction
    | CommentCreateSuccessAction
    | CommentCreateFailedAction
    | CommentEditSuccessAction
    | CommentEditFailedAction
    | CommentGetSuccessAction
    | CommentGetFailedAction
    | CommentRemoveSuccessAction
    | CommentRemoveFailedAction
    | CommentLikeSuccessAction
    | CommentLikeFailedAction
    | CommentDontLikeSuccessAction
    | CommentDontLikeFailedAction
