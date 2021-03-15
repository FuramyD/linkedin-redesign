import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { ChatModule } from './chat/chat.module'
import { FeedModule } from './feed/feed.module'
import { JobsModule } from './jobs/jobs.module'
import { NetworkModule } from './network/network.module'
import { NoticesModule } from './notices/notices.module'
import { ProfileModule } from './profile/profile.module'
import { PipesModule } from '../pipes/pipes.module'
import { SvgIconModule } from '../svg-icon/svg-icon.module'

import { ICONS_PATH } from '../svg-icon/icons-path'

import { AuthComponent } from './auth/auth.component'
import { RegistrationComponent } from './registration/registration.component'

@NgModule({
    declarations: [AuthComponent, RegistrationComponent],
    imports: [
        CommonModule,
        ChatModule,
        FeedModule,
        JobsModule,
        NetworkModule,
        NoticesModule,
        ProfileModule,
        PipesModule,
        SvgIconModule,
        RouterModule,
        ReactiveFormsModule,
        HttpClientModule,
    ],
    providers: [
        {
            provide: ICONS_PATH,
            useValue: 'assets/img/svg',
        },
    ],
})
export class ViewsModule {}
