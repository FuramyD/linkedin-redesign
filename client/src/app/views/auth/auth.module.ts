import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AuthorizationComponent } from './authorization/authorization.component'
import { RegistrationComponent } from './registration/registration.component'
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms'
import { SvgIconModule } from '../../svg-icon/svg-icon.module'
import { RouterModule } from '@angular/router'

@NgModule({
    declarations: [AuthorizationComponent, RegistrationComponent],
    imports: [
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        SvgIconModule,
        RouterModule,
    ],
})
export class AuthModule {}
