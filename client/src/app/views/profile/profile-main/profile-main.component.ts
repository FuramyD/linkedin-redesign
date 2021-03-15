import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'app-profile-main',
    templateUrl: './profile-main.component.html',
    styleUrls: ['./profile-main.component.less', '../profile.component.less'],
})
export class ProfileMainComponent implements OnInit {
    constructor() {}

    currentTab = 'profile'

    activateTab(e: MouseEvent): void {
        const element = e.target as HTMLElement
        const parent = element.parentNode as HTMLElement
        const children = Array.from(parent.children)

        children.forEach(el => el.classList.remove('active'))

        element.classList.add('active')
        this.currentTab = (element.textContent as string).toLowerCase()
    }

    ngOnInit(): void {}
}
