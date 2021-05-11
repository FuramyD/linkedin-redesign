import { Component, EventEmitter, OnInit, Output } from '@angular/core'

@Component({
    selector: 'app-edit-profile-side',
    templateUrl: './edit-profile-side.component.html',
    styleUrls: ['./edit-profile-side.component.less'],
})
export class EditProfileSideComponent implements OnInit {
    @Output() onChangeTab = new EventEmitter<string>()

    constructor() {}

    activateTab(e: MouseEvent, menu: HTMLElement): void {
        const tabs = Array.from(menu.children) as HTMLElement[]
        const target = e.target as HTMLElement

        if (target.classList.contains('menu')) return

        tabs.forEach(el => el.classList.remove('active'))
        if (!target.classList.contains('tab')) {
            const tab = target.closest('.tab') as HTMLElement
            tab.classList.add('active')
            this.onChangeTab.emit(tab.textContent ?? '')
        } else {
            target.classList.add('active')
            this.onChangeTab.emit(target.textContent ?? '')
        }
    }

    ngOnInit(): void {}
}
