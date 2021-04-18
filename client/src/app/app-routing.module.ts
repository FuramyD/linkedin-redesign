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
import { AuthorizationComponent } from './views/auth/authorization/authorization.component'
import { RegistrationComponent } from './views/auth/registration/registration.component'
import { AuthGuard } from './guards/auth.guard'

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/feed' },
    {
        component: BaseLayoutComponent,
        path: '',
        children: [
            {
                path: 'feed',
                component: FeedComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'network',
                component: NetworkComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'jobs',
                component: JobsComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'chats',
                component: ChatComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'notices',
                component: NoticesComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'profile',
                component: ProfileComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'profile/:id',
                component: ProfileComponent,
                canActivate: [AuthGuard],
            },
        ],
    },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            { path: 'signup', component: RegistrationComponent },
            { path: 'signin', component: AuthorizationComponent },
        ],
    },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard],
})
export class AppRoutingModule {}
