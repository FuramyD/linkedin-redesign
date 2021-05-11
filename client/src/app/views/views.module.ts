import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

import { ChatModule } from './chat/chat.module'
import { FeedModule } from './feed/feed.module'
import { JobsModule } from './jobs/jobs.module'
import { NetworkModule } from './network/network.module'
import { NoticesModule } from './notices/notices.module'
import { ProfileModule } from './profile/profile.module'
import { PipesModule } from '../pipes/pipes.module'
import { SvgIconModule } from '../svg-icon/svg-icon.module'

import { ICONS_PATH } from '../svg-icon/icons-path'
import { AuthModule } from './auth/auth.module'
import { PostsService } from '../services/posts.service'

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ChatModule,
        FeedModule,
        JobsModule,
        NetworkModule,
        NoticesModule,
        ProfileModule,
        AuthModule,
        PipesModule,
        SvgIconModule,
        RouterModule,
    ],
    providers: [
        {
            provide: ICONS_PATH,
            useValue: 'assets/img/svg',
        },
        PostsService,
    ],
    exports: [],
})
export class ViewsModule {}
