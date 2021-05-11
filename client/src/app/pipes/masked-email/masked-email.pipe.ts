import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'maskedEmail',
})
export class MaskedEmailPipe implements PipeTransform {
    transform(value: string, ...args: unknown[]): string {
        const [startEmail, endEmail] = value.split('@')
        const maskedStart = `${startEmail[0] + startEmail[1]}•••`

        return maskedStart + '@' + endEmail
    }
}
