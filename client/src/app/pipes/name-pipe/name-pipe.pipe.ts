import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'namePipe',
})
export class NamePipe implements PipeTransform {
    transform(value: string, ...args: unknown[]): string {
        const [firstName, lastName] = value.split(' ')
        return `${firstName[0]}. ${lastName}`
    }
}
