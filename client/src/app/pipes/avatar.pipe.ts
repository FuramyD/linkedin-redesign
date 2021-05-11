import { Pipe, PipeTransform } from '@angular/core'
import { IBuffer } from '../interfaces/buffer'

@Pipe({
    name: 'avatar',
})
export class AvatarPipe implements PipeTransform {
    transform(value: IBuffer | string | null, ...args: unknown[]): any {
        if (typeof value === 'string') return value
        if (value === null) return 'assets/img/avatar-man.png'

        const arrayBufferView = new Uint8Array(value.data)
        // const blob = new Blob([ arrayBufferView ], { type: 'image/jpeg' })
        // console.log(blob)
        // const urlCreator = window.URL || window.webkitURL
        //
        // return urlCreator.createObjectURL(blob)
    }
}
