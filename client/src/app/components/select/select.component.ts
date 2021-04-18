import { Component, Input, OnInit } from '@angular/core'
import { IsdCountryCode } from '../../../../../server/src/interfaces/auth/isdCountryCode'

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.less'],
})
export class SelectComponent implements OnInit {
    constructor() {}

    // @Input() IsdCountryCodes: IsdCountryCode[]

    ngOnInit(): void {}
}
