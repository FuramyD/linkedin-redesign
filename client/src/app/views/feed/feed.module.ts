import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { SvgIconModule } from '../../svg-icon/svg-icon.module'

import { FeedComponent } from './feed.component'
import { FeedMainComponent } from './feed-main/feed-main.component'
import { FeedSideComponent } from './feed-side/feed-side.component'
import { PostComponent } from '../../components/post/post.component'
import { FormsModule } from '@angular/forms'

@NgModule({
    declarations: [
        FeedComponent,
        FeedMainComponent,
        FeedSideComponent,
        PostComponent,
    ],
    imports: [CommonModule, SvgIconModule, FormsModule],
})
export class FeedModule {}
