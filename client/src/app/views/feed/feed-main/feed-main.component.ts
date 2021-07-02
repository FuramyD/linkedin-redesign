import {Component, OnDestroy, OnInit} from '@angular/core'
import { FileService } from 'src/app/services/file.service'
import { select, Store } from '@ngrx/store'
import { PostState } from '../../../store/posts/post.reducer'
import {
    PostCreateAction,
    PostGetAction,
    SortingPostsAction,
} from '../../../store/posts/post.actions'
import {Observable, Subject} from 'rxjs'
import {map, takeUntil} from 'rxjs/operators'
import { postsSelector } from '../../../store/posts/post.selectors'
import { IPost } from '../../../interfaces/post/post'
import { ICreator } from '../../../interfaces/post/creator'
import { IAttached } from '../../../interfaces/post/attached'
import { MyProfileState } from '../../../store/my-profile/my-profile.reducer'
import {
    myProfileIdSelector,
    myProfileSelector,
} from '../../../store/my-profile/my-profile.selectors'

@Component({
    selector: 'app-feed-main',
    templateUrl: './feed-main.component.html',
    styleUrls: ['./feed-main.component.less', '../feed.component.less'],
})
export class FeedMainComponent implements OnInit, OnDestroy {
    constructor(
        private fileService: FileService,
        private store$: Store<PostState | MyProfileState>,
    ) {}

    unsub$ = new Subject()

    posts$: Observable<IPost[]> = this.store$.pipe(select(postsSelector))

    isPosts$: Observable<boolean> = this.posts$.pipe(map(posts => !!posts[0]))

    creator$: Observable<ICreator> = this.store$.pipe(
        select(myProfileSelector),
        map(profile => {
            console.log('PROFILE => ', profile)
            return {
                id: profile.id,
                fullName: `${profile.firstName} ${profile.lastName}`,
                profession: profile.info.profession,
                avatar:
                    profile.info.avatar?.url ??
                    '../../../../assets/img/avatar-man.png',
            }
        }),
    )

    feedPostSortingType: string | null = 'newest first'

    attached: IAttached = {}

    creator: ICreator = {
        id: 0,
        fullName: '',
        profession: '',
        avatar: '',
    }
    textareaContent: string = ''

    createPost(): void {
        console.log(this.textareaContent)
        this.store$.dispatch(
            new PostCreateAction({
                creator: this.creator,
                content: this.textareaContent,
                dateOfCreation: Date.now(),
                attached: this.attached,
            }),
        )
        this.textareaContent = ''
    }

    textareaResize(e: Event): void {
        const elem = e.target as HTMLElement
        const offset = elem.offsetHeight - elem.clientHeight

        elem.style.height = 'auto'
        elem.style.height = elem.scrollHeight + offset + 'px'
    }

    changeSortingType(e: MouseEvent, sortList: HTMLElement): void {
        const elem = e.target as HTMLElement
        this.feedPostSortingType = elem.textContent
        console.log(elem.textContent)
        this.store$.dispatch(
            new SortingPostsAction({ sortType: elem.textContent as string }),
        )

        sortList.classList.remove('active')
    }

    fileUpload(fileInput: HTMLInputElement, type: string): void {
        this.fileService.fileUpload(fileInput, type, this.attached)
    }

    ngOnInit(): void {
        this.creator$.pipe(takeUntil(this.unsub$)).subscribe(creator => (this.creator = creator))
        this.posts$.pipe(takeUntil(this.unsub$)).subscribe(posts => console.log('posts =>', posts))

        this.store$.dispatch(new PostGetAction({ id: 'all' }))
    }

    ngOnDestroy(): void {
        this.unsub$.next()
        this.unsub$.complete()
    }
}
