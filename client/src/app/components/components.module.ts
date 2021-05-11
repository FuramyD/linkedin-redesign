import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

import { UsersListComponent } from './network/users-list/users-list.component'
import { SelectComponent } from './select/select.component'
import { SvgIconModule } from '../svg-icon/svg-icon.module'
import { AccountDeletedComponent } from './account-deleted/account-deleted.component'

@NgModule({
    declarations: [
        UsersListComponent,
        SelectComponent,
        AccountDeletedComponent,
    ],
    imports: [CommonModule, RouterModule, SvgIconModule],
    exports: [UsersListComponent, SelectComponent],
})
export class ComponentsModule {}
