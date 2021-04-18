import { Component, OnInit } from '@angular/core'
import { AuthState } from '../../store/auth/auth.reducer'
import { select, Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { authStatusSelector } from '../../store/auth/auth.selectors'
import { Router } from '@angular/router'
import { PostGetAction } from '../../store/posts/post.actions'

@Component({
    selector: 'app-base-layout',
    templateUrl: './base.component.html',
    styleUrls: ['./base.component.less'],
})
export class BaseLayoutComponent implements OnInit {
    authStatus$: Observable<boolean> = this.store$.pipe(
        select(authStatusSelector),
    )

    constructor(private store$: Store<AuthState>, private router: Router) {}

    ngOnInit(): void {
        this.authStatus$.subscribe(res => {
            if (!res) {
                this.router.navigate(['/signin'])
            }
        })
    }
}
