import { Injectable } from '@angular/core'
import { Actions, Effect, ofType } from '@ngrx/effects'
import {
    COMMENT_CREATE_ACTION_TYPE,
    CommentCreateAction,
    CommentCreateFailedAction,
    CommentCreateSuccessAction,
    POST_CREATE_ACTION_TYPE,
    POST_CREATE_FAILED_ACTION_TYPE,
    POST_DONT_LIKE_ACTION_TYPE,
    POST_GET_ACTION_TYPE,
    POST_LIKE_ACTION_TYPE,
    PostActions,
    PostCreateAction,
    PostCreateFailedAction,
    PostCreateSuccessAction,
    PostDontLikeAction,
    PostDontLikeFailedAction,
    PostDontLikeSuccessAction,
    PostGetAction,
    PostGetFailedAction,
    PostGetSuccessAction,
    PostLikeAction,
    PostLikeFailedAction,
    PostLikeSuccessAction,
} from './post.actions'
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators'
import { PostsService } from '../../services/posts.service'
import { Observable, of } from 'rxjs'
import { PostDto } from '../../dto/post.dto'
import { CommentDto } from '../../dto/comment.dto'

@Injectable()
export class PostEffects {
    constructor(
        private actions$: Actions,
        private postsService: PostsService,
    ) {}

    @Effect()
    createPost$(): Observable<PostActions> {
        return this.actions$.pipe(
            ofType(POST_CREATE_ACTION_TYPE),
            switchMap((action: PostCreateAction) => {
                return this.postsService
                    .createPost(action.payload as PostDto)
                    .pipe(
                        map(post => {
                            console.log('PAYLOAD:', action.payload)
                            return new PostCreateSuccessAction({ post })
                        }),
                        catchError(err =>
                            of(new PostCreateFailedAction({ err })),
                        ),
                    )
            }),
        )
    }

    editPost$(): Observable<PostActions> | any {}
    removePost$(): Observable<PostActions> | any {}

    @Effect()
    likePost$(): Observable<PostActions> {
        return this.actions$.pipe(
            ofType(POST_LIKE_ACTION_TYPE),
            switchMap((action: PostLikeAction) => {
                const payload = action.payload
                return this.postsService
                    .likePost(payload.postId, payload.userId)
                    .pipe(
                        map(like => {
                            return new PostLikeSuccessAction({
                                postId: payload.postId,
                                userId: payload.userId,
                            })
                        }),
                        catchError(err =>
                            of(new PostLikeFailedAction({ err })),
                        ),
                    )
            }),
        )
    }

    @Effect()
    dontLikePost$(): Observable<PostActions> {
        return this.actions$.pipe(
            ofType(POST_DONT_LIKE_ACTION_TYPE),
            switchMap((action: PostDontLikeAction) => {
                const payload = action.payload
                return this.postsService
                    .dontLikePost(payload.postId, payload.userId)
                    .pipe(
                        map(like => {
                            return new PostDontLikeSuccessAction({
                                postId: payload.postId,
                                userId: payload.userId,
                            })
                        }),
                        catchError(err =>
                            of(new PostDontLikeFailedAction({ err })),
                        ),
                    )
            }),
        )
    }

    @Effect()
    addComment$(): Observable<PostActions> {
        return this.actions$.pipe(
            ofType(COMMENT_CREATE_ACTION_TYPE),
            switchMap((action: CommentCreateAction) => {
                const payload = action.payload as {
                    postId: number
                    commentInfo: CommentDto
                }
                return this.postsService
                    .createComment(payload.commentInfo, payload.postId)
                    .pipe(
                        map(comments => {
                            return new CommentCreateSuccessAction({
                                ...comments,
                                postId: payload.postId,
                            })
                        }),
                        catchError(err =>
                            of(new CommentCreateFailedAction({ err })),
                        ),
                    )
            }),
        )
    }

    @Effect()
    getPosts$(): Observable<PostActions> {
        return this.actions$.pipe(
            ofType(POST_GET_ACTION_TYPE),
            switchMap((action: PostGetAction) => {
                return this.postsService.getPosts(action.payload.id).pipe(
                    map(posts => {
                        return posts.posts
                    }),
                    map(posts => new PostGetSuccessAction({ posts })),
                    catchError(err => of(new PostGetFailedAction({ err }))),
                )
            }),
        )
    }
}
