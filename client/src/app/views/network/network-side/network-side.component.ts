import {Component, EventEmitter, OnInit, Output} from '@angular/core'

@Component({
    selector: 'app-network-side',
    templateUrl: './network-side.component.html',
    styleUrls: ['./network-side.component.less'],
})
export class NetworkSideComponent implements OnInit {
    constructor() {}

    @Output() activateItem: EventEmitter<string> = new EventEmitter<string>()

    activeMenuItem: string = ''

    activateListItem(e: MouseEvent, list: HTMLElement): void {
        if (e.target === list) return

        const element = (e.target as HTMLElement).closest('.menu__item')
        if (element) {
            const listItems = Array.from(list.children)

            listItems.forEach(el => el.classList.remove('active'))
            element.classList.add('active')

            this.activeMenuItem = element.querySelector('.title')?.textContent ?? ''
            this.activateItem.emit(this.activeMenuItem.toLowerCase().trim())
        }
    }

    ngOnInit(): void {}
}
