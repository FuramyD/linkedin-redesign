import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'prefixPlus',
})
export class PrefixPlusPipe implements PipeTransform {
    transform(value: number | string, ...args: unknown[]): string {
        value = Number(value)
        if (value || value === 0) {
            if (value >= 0) {
                return `+${value}`
            }
            return `${value}`
        }

        return 'Not a Number'
    }
}
