import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core'
import { EMPTY, fromEvent, Subscription } from 'rxjs'
import { debounceTime, map, switchMap } from 'rxjs/operators'
import { IUser } from '../../../../interfaces/user'
import { environment } from '../../../../../environments/environment'

// @ts-ignore
import { HystModal } from '../../../../plugins/hystModal_'
import { ProfileService } from '../../../../services/profile.service'

@Component({
    selector: 'app-users-list-nwk',
    templateUrl: './users-list-nwk.component.html',
    styleUrls: ['../users-list.component.less'],
})
export class UsersListNwkComponent implements OnInit, OnDestroy, AfterViewInit {
    constructor(private profileService: ProfileService) {}

    private subs: Subscription[] = []
    private set sub(s: Subscription) {
        this.subs.push(s)
    }

    // @ts-ignore
    private searchSub: Subscription

    currentUserId: number = -1

    @Input() connections: { user: IUser; date: number }[] = []
    @Input() isMyProfile: boolean = false
    @Input() myProfileId: number = -1

    @Output() action = new EventEmitter<{
        action: string
        userId: number
        message?: string
    }>()

    @ViewChild('searchConnections') search: ElementRef | null = null

    otherUsers: IUser[] = []

    isMyConnection(
        connections: { user: IUser; date: number }[],
        userId: number,
    ): boolean {
        return !!connections.find(con => con.user.id === userId)
    }

    isMySentConnection(user: IUser): boolean {
        return !!user.info.receivedConnections.find(
            u => u.userId === this.myProfileId,
        )
    }

    isMyIncomingConnection(user: IUser): boolean {
        return !!user.info.sentConnections.find(
            u => u.userId === this.myProfileId,
        )
    }

    sendConnection(userId: number, message: string): void {
        this.action.emit({ action: 'send', userId, message })
        this.updateUsers()
    }

    acceptConnection(userId: number): void {
        this.action.emit({ action: 'accept', userId })
        this.updateUsers()
    }

    cancelConnection(userId: number): void {
        this.action.emit({ action: 'cancel', userId })
        this.updateUsers()
    }

    declineConnection(userId: number): void {
        this.action.emit({ action: 'decline', userId })
        this.updateUsers()
    }

    removeConnection(userId: number): void {
        this.action.emit({ action: 'remove', userId })
        this.updateUsers()
    }

    updateUsers(): void {
        this.searchSub?.unsubscribe()
        setTimeout(() => {
            this.searchSub = this.profileService
                .findUsersByFullName(this.search?.nativeElement.value)
                .subscribe(res => {
                    this.otherUsers = res.filter(
                        user =>
                            user.id !== this.myProfileId &&
                            !user.info.connections.find(
                                connection =>
                                    connection.userId === this.myProfileId,
                            ), // &&
                        // !user.info.sentConnections.find(connection => connection.userId === this.myProfileId) &&
                        // !user.info.receivedConnections.find(connection => connection.userId === this.myProfileId)
                    )
                    console.log(this.otherUsers)
                })
        }, 300)
    }

    ngAfterViewInit(): void {
        if (!this.search) console.log('Не нашел поиск')
        this.sub = fromEvent<InputEvent>(this.search?.nativeElement, 'input')
            .pipe(
                debounceTime(500),
                map((ev: InputEvent) => (ev.target as HTMLInputElement).value),
                switchMap(value => {
                    if (value === '') return []
                    return this.profileService.findUsersByFullName(value)
                }),
            )
            .subscribe((res: IUser[]) => {
                this.otherUsers = res.filter(
                    user =>
                        user.id !== this.myProfileId &&
                        !user.info.connections.find(
                            connection =>
                                connection.userId === this.myProfileId,
                        ), // &&
                    // !user.info.sentConnections.find(connection => connection.userId === this.myProfileId) &&
                    // !user.info.receivedConnections.find(connection => connection.userId === this.myProfileId)
                )
                console.log(this.otherUsers)
            })
    }

    ngOnInit(): void {
        const sendConnectionModal = new HystModal({
            linkAttributeName: 'data-hystmodal',
        })
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe())
    }
}
