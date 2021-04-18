import {Component, Input, OnDestroy, OnInit} from '@angular/core'
import {Subscription} from "rxjs";
import {IUser} from "../../../interfaces/user";

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

    @Input() connections: { user: IUser, date: number}[] = []

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe())
    }
}
