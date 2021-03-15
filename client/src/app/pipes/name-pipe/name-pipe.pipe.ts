import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'namePipe',
})
export class NamePipe implements PipeTransform {
    transform(value: string, ...args: unknown[]): string {
        // tslint:disable-next-line:prefer-const
        let [firstName, lastName] = value.split(' ')
        return `${firstName[0]}. ${lastName}`
    }
}
