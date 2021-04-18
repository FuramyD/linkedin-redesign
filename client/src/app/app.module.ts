import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppRoutingModule } from './app-routing.module'
import { SvgIconModule } from './svg-icon/svg-icon.module'
import { ViewsModule } from './views/views.module'
import { PipesModule } from './pipes/pipes.module'
import { ReactiveFormsModule } from '@angular/forms'

import { AppComponent } from './app.component'
import { HeaderComponent } from './components/header/header.component'
import { FooterComponent } from './components/footer/footer.component'
import { AuthLayoutComponent } from './layouts/auth/auth.component'
import { BaseLayoutComponent } from './layouts/base/base.component'

import { StoreModule } from '@ngrx/store'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { environment } from '../environments/environment'
import { EffectsModule } from '@ngrx/effects'
import { StoreRouterConnectingModule } from '@ngrx/router-store'
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io'

import { metaReducers, reducers } from './store'
import { PostEffects } from './store/posts/post.effects'
import { MyProfileEffects } from './store/my-profile/my-profile.effects'
import { ProfileEffects } from './store/profile/profile.effects'
import { InvitationsComponent } from './components/network/invitations/invitations.component'
import { NetworkModule } from './views/network/network.module'

const config: SocketIoConfig = { url: environment.server_url, options: {} }

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        AuthLayoutComponent,
        BaseLayoutComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        SvgIconModule,
        ViewsModule,
        PipesModule,
        ReactiveFormsModule,
        StoreModule.forRoot(reducers, {
            metaReducers,
            runtimeChecks: {
                strictActionImmutability: true,
                strictStateImmutability: true,
            },
        }),
        StoreDevtoolsModule.instrument({
            maxAge: 25,
            logOnly: environment.production,
        }),
        EffectsModule.forRoot([PostEffects, MyProfileEffects, ProfileEffects]),
        StoreRouterConnectingModule.forRoot(),
        SocketIoModule.forRoot(config),
    ],
    providers: [],
    bootstrap: [AppComponent],
    exports: [],
})
export class AppModule {}
