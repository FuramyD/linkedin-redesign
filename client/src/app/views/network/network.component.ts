import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'app-network',
    templateUrl: './network.component.html',
    styleUrls: ['./network.component.less'],
})
export class NetworkComponent implements OnInit {
    constructor() {}

    activeTab: string = 'invitations'

    activateTab(tab: string): void {
        console.log(tab)
        this.activeTab = tab
    }

    ngOnInit(): void {}
}

