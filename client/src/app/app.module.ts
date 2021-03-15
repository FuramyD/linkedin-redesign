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
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
