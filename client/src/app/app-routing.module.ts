import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { BaseLayoutComponent } from './layouts/base/base.component'
import { FeedComponent } from './views/feed/feed.component'
import { NetworkComponent } from './views/network/network.component'
import { JobsComponent } from './views/jobs/jobs.component'
import { ChatComponent } from './views/chat/chat.component'
import { NoticesComponent } from './views/notices/notices.component'
import { ProfileComponent } from './views/profile/profile.component'
import { AuthLayoutComponent } from './layouts/auth/auth.component'
import { RegistrationComponent } from './views/registration/registration.component'
import { AuthComponent } from './views/auth/auth.component'

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/feed' },
    {
        component: BaseLayoutComponent,
        path: '',
        children: [
            { path: 'feed', component: FeedComponent },
            { path: 'network', component: NetworkComponent },
            { path: 'jobs', component: JobsComponent },
            { path: 'chat', component: ChatComponent },
            { path: 'notices', component: NoticesComponent },
            { path: 'profile', component: ProfileComponent },
        ],
    },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            { path: 'signup', component: RegistrationComponent },
            { path: 'signin', component: AuthComponent },
        ],
    },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
