import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.less'],
})
export class EditProfileComponent implements OnInit {
    constructor() {}

    currentTab: string = 'Additional information' // 'Personal data'

    changeTab(tab: string): void {
        this.currentTab = tab.trim()
    }

    ngOnInit(): void {}
}
