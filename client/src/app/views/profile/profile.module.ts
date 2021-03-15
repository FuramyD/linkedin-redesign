import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { ProfileComponent } from './profile.component'
import { ProfileMainComponent } from './profile-main/profile-main.component'
import { ProfileSideComponent } from './profile-side/profile-side.component'

@NgModule({
    declarations: [
        ProfileComponent,
        ProfileMainComponent,
        ProfileSideComponent,
    ],
    imports: [CommonModule],
})
export class ProfileModule {}
