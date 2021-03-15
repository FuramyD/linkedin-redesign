import {
    ChangeDetectionStrategy,
    Component,
    Input,
    Inject,
} from '@angular/core'
import { ICONS_PATH } from './icons-path'

@Component({
    selector: 'svg[icon]',
    template: '<svg:use [attr.href]="href"></svg:use>',
    styles: [':host { fill: transparent; stroke: transparent; }'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgIconComponent {
    @Input()
    icon = ''

    constructor(@Inject(ICONS_PATH) private readonly path: string) {}

    get href(): string {
        return `${this.path}/${this.icon}.svg#${this.icon}Icon`
    }
}
