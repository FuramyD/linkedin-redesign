import { Component, OnInit } from '@angular/core'
import { FileService } from 'src/app/services/file.service'
import { IAttach } from '../../../interfaces/attach'
import { IAttached } from '../../../interfaces/attached'

@Component({
    selector: 'app-feed-main',
    templateUrl: './feed-main.component.html',
    styleUrls: ['./feed-main.component.less', '../feed.component.less'],
})
export class FeedMainComponent implements OnInit {
    feedPostSortingType: string | null = 'trending'

    attached: IAttached = {
        files: [],
        images: [],
        videos: [],
    }

    constructor(private fileService: FileService) {}

    textareaResize(e: Event): void {
        const elem = e.target as HTMLElement
        const offset = elem.offsetHeight - elem.clientHeight

        elem.style.height = 'auto'
        elem.style.height = elem.scrollHeight + offset + 'px'
    }

    changeSortingType(e: MouseEvent, sortList: HTMLElement): void {
        const elem = e.target as HTMLElement
        this.feedPostSortingType = elem.textContent

        sortList.classList.remove('active')
    }

    fileUpload(fileInput: HTMLInputElement, type: string): void {
        this.fileService.fileUpload(fileInput, type, this.attached)
    }

    ngOnInit(): void {}
}
