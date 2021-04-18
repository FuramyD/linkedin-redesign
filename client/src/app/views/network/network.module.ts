import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { NetworkComponent } from './network.component'
import { NetworkSideComponent } from './network-side/network-side.component'
import { NetworkMainComponent } from './network-main/network-main.component'
import { SvgIconModule } from '../../svg-icon/svg-icon.module'
import { RouterModule } from '@angular/router'
import { UsersListComponent } from '../../components/network/users-list/users-list.component'
import { ConnectionsListComponent } from '../../components/network/connections-list/connections-list.component'
import { InvitationsComponent } from '../../components/network/invitations/invitations.component'

@NgModule({
    declarations: [
        NetworkComponent,
        NetworkSideComponent,
        NetworkMainComponent,
        UsersListComponent,
        ConnectionsListComponent,
        InvitationsComponent,
    ],
    imports: [CommonModule, SvgIconModule, RouterModule],
    exports: [ConnectionsListComponent],
})
export class NetworkModule {}
