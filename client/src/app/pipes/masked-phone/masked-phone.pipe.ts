import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'maskedPhone',
})
export class MaskedPhonePipe implements PipeTransform {
    transform(value: string, ...args: unknown[]): string {
        const length = value.length

        let result = value[0] + value[1]
        for (let i = 2; i < length - 2; i++) {
            result += '•'
        }
        result += value[length - 2]
        result += value[length - 1]

        return result
    }
}
