import { Component, Input, OnInit } from '@angular/core'
import { FeedMainComponent } from '../../views/feed/feed-main/feed-main.component'
import { select, Store } from '@ngrx/store'
import { PostState } from '../../store/posts/post.reducer'
import { MyProfileState } from '../../store/my-profile/my-profile.reducer'
import {
    CommentCreateAction,
    PostCommentsCloseAction,
    PostCommentsOpenAction,
    PostDontLikeAction,
    PostLikeAction,
} from '../../store/posts/post.actions'
import { myProfileSelector } from '../../store/my-profile/my-profile.selectors'
import { map } from 'rxjs/operators'
import { PostsService } from '../../services/posts.service'
import { ILike } from '../../interfaces/post/like'
import { IPost } from '../../interfaces/post/post'
import { ICreator } from '../../interfaces/post/creator'
import { Observable, of } from 'rxjs'

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.less'],
})
export class PostComponent implements OnInit {
    constructor(
        private feedMainComponent: FeedMainComponent,
        private store$: Store<PostState | MyProfileState>,
        private postsService: PostsService,
    ) {}

    @Input() postInfo: IPost = {
        attached: {},
        content: '',
        creator: {
            id: 0,
            fullName: '',
            profession: '',
            avatar: '',
        },
        dateOfCreation: 0,
        id: 0,
        likes: [],
        comments: [],
        commentsOpen: false,
    }

    content: string = ''

    profile: ICreator = {
        id: 0,
        fullName: '',
        profession: '',
        avatar: '',
    }

    likes: ILike[] = this.postInfo.likes
    liked: boolean = false

    createComment(textarea: HTMLTextAreaElement): void {
        this.store$.dispatch(
            new CommentCreateAction({
                postId: this.postInfo.id,
                commentInfo: {
                    creator: this.profile,
                    content: textarea.value.replace(/\n/g, '<br>'),
                    dateOfCreation: Date.now(),
                },
            }),
        )
    }

    likePost(like: HTMLElement): void {
        if (!this.liked) {
            like.classList.add('waiting')
            this.store$.dispatch(
                new PostLikeAction({
                    postId: this.postInfo.id,
                    userId: this.profile.id,
                }),
            )
            // like.classList.remove('waiting')
        } else {
            like.classList.add('waiting')
            this.store$.dispatch(
                new PostDontLikeAction({
                    postId: this.postInfo.id,
                    userId: this.profile.id,
                }),
            )
        }
    }

    openCloseComments(): void {
        if (!this.postInfo.commentsOpen)
            this.store$.dispatch(
                new PostCommentsOpenAction({ postId: this.postInfo.id }),
            )
        if (this.postInfo.commentsOpen)
            this.store$.dispatch(
                new PostCommentsCloseAction({ postId: this.postInfo.id }),
            )
    }

    likeComment(): void {}

    textareaResize(e: Event): void {
        this.feedMainComponent.textareaResize(e)
    }

    ngOnInit(): void {
        console.log(this.postInfo)
        this.content = this.postInfo.content.replace(/\n/g, '<br>')
        this.likes = this.postInfo.likes
        this.store$
            .pipe(
                select(myProfileSelector),
                map(profile => {
                    return {
                        id: profile.id,
                        fullName: `${profile.firstName} ${profile.lastName}`,
                        profession: profile.info.profession,
                        avatar:
                            profile.info.avatar ||
                            '../../../../assets/img/avatar-man.png',
                    }
                }),
            )
            .subscribe(creator => (this.profile = creator))

        this.liked = !!this.likes.find(like => like.userId === this.profile.id)

        console.log('likes', this.likes)
        console.log('liked', this.liked)
    }
}
