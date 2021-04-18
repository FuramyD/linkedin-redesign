import { Injectable } from '@angular/core'

import { IAttach } from '../../../../server/src/interfaces/post/attach'
import { IAttached } from '../../../../server/src/interfaces/post/attached'

@Injectable({
    providedIn: 'root',
})
export class FileService {
    constructor() {}

    fileUpload(
        fileInput: HTMLInputElement,
        type: string,
        attached: IAttached,
    ): void {
        fileInput.onchange = (e: Event) => {
            const { files } = e.target as HTMLInputElement

            ;[].forEach.call(files, (file: File) => {
                const fileReader = new FileReader()

                console.log(file)

                fileReader.onload = (ev: ProgressEvent) => {
                    const fr = ev.target as FileReader
                    console.log(fr)

                    const attach: IAttach = {
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        result: fr.result,
                    }

                    if (file.type.match('image')) {
                        if (!attached.images) attached.images = []
                        attached.images.push(attach)
                    } else if (file.type.match('video')) {
                        if (!attached.videos) attached.videos = []
                        attached.videos.push(attach)
                    } else {
                        if (!attached.files) attached.files = []
                        attached.files.push(attach)
                    }
                }

                fileReader.readAsDataURL(file)
            })
        }

        fileInput.click()
    }
}
