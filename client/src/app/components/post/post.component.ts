import { Component, OnInit } from '@angular/core'
import { FeedMainComponent } from '../../views/feed/feed-main/feed-main.component'

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.less'],
})
export class PostComponent implements OnInit {
    constructor(private feedMainComponent: FeedMainComponent) {}

    textareaResize(e: Event): void {
        this.feedMainComponent.textareaResize(e)
    }

    ngOnInit(): void {}
}
