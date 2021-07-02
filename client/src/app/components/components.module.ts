import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

import { UsersListMdlComponent } from './network/users-list/users-list-mdl/users-list-mdl.component'
import { UsersListNwkComponent } from './network/users-list/users-list-nwk/users-list-nwk.component'
import { SelectComponent } from './select/select.component'
import { SvgIconModule } from '../svg-icon/svg-icon.module'
import { AccountDeletedComponent } from './account-deleted/account-deleted.component'

@NgModule({
    declarations: [
        UsersListNwkComponent,
        UsersListMdlComponent,
        SelectComponent,
        AccountDeletedComponent,
    ],
    imports: [CommonModule, RouterModule, SvgIconModule],
    exports: [UsersListMdlComponent, UsersListNwkComponent, SelectComponent],
})
export class ComponentsModule {}
