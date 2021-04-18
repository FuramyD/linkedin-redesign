import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { IUser } from '../../../interfaces/user'

@Component({
    selector: 'app-connections-list',
    templateUrl: './connections-list.component.html',
    styleUrls: ['./connections-list.component.less'],
})
export class ConnectionsListComponent implements OnInit {
    @Input() connections: { user: IUser; message: string }[] = []
    @Input() type: string = ''

    @Output() action = new EventEmitter<{ type: string; id: number }>()

    acceptConnection(id: number): void {
        this.action.emit({ type: 'accept', id })
    }
    declineConnection(id: number): void {
        this.action.emit({ type: 'decline', id })
    }
    cancelConnection(id: number): void {
        this.action.emit({ type: 'cancel', id })
    }

    constructor() {}

    ngOnInit(): void {}
}
