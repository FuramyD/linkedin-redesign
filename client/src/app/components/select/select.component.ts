import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core'
import { IsdCountryCode } from '../../../../../server/src/interfaces/auth/isdCountryCode'

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.less'],
})
export class SelectComponent implements OnInit, OnChanges {
    constructor() {}

    @Input() options: string[] = []
    @Input() selectedByDefault: string = ''
    @Input() error: boolean = false

    @Output() onChange = new EventEmitter<string>()

    selected: string = ''

    toggleOptions(el: HTMLElement): void {
        el.classList.toggle('show')
    }

    closeOptions(el: HTMLElement): void {
        el.classList.remove('show')
    }

    changeSelected(option: string, select: HTMLElement): void {
        this.closeOptions(select)
        if (this.selected === option) return
        this.selected = option
        this.onChange.emit(option)
    }

    ngOnInit(): void {
        this.onChange.emit(this.selectedByDefault)
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('selectedByDefault'))
            this.onChange.emit(changes.selectedByDefault.currentValue)
    }
}
