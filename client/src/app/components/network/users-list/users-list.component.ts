import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core'
import { Subscription } from 'rxjs'
import { IUser } from '../../../interfaces/user'

@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.less'],
})
export class UsersListComponent implements OnInit, OnDestroy {
    constructor() {}

    private subs: Subscription[] = []
    private set sub(s: Subscription) {
        this.subs.push(s)
    }

    @Input() connections: { user: IUser; date: number }[] = []
    @Input() isMyProfile: boolean = false

    @Output() action: EventEmitter<{
        action: string
        userId: number
    }> = new EventEmitter<{ action: string; userId: number }>()

    removeConnection(userId: number): void {
        this.action.emit({ action: 'remove', userId })
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe())
    }
}
