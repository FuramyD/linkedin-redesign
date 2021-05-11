import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { ComponentsModule } from '../../components/components.module'
import { SvgIconModule } from '../../svg-icon/svg-icon.module'

import { ProfileComponent } from './profile.component'
import { ProfileMainComponent } from './profile-main/profile-main.component'
import { ProfileSideComponent } from './profile-side/profile-side.component'

import { EditProfileSideComponent } from './edit-profile/edit-profile-side/edit-profile-side.component'
import { EditProfileMainComponent } from './edit-profile/edit-profile-main/edit-profile-main.component'
import { EditProfileComponent } from './edit-profile/edit-profile.component'
import { EditPersonalDataComponent } from './edit-profile/edit-components/edit-personal-data/edit-personal-data.component'
import { EditLoginAndSecurityComponent } from './edit-profile/edit-components/edit-login-and-security/edit-login-and-security.component'
import { EditAdditionalInfoComponent } from './edit-profile/edit-components/edit-additional-info/edit-additional-info.component'
import { PipesModule } from '../../pipes/pipes.module'
import { VarDirective } from '../../directives/var.directive'
import { DirectivesModule } from '../../directives/directives.module'

@NgModule({
    declarations: [
        ProfileComponent,
        ProfileMainComponent,
        ProfileSideComponent,
        EditProfileComponent,
        EditProfileSideComponent,
        EditProfileMainComponent,
        EditPersonalDataComponent,
        EditLoginAndSecurityComponent,
        EditAdditionalInfoComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        RouterModule,
        ReactiveFormsModule,
        SvgIconModule,
        FormsModule,
        PipesModule,
        DirectivesModule,
    ],
})
export class ProfileModule {}
