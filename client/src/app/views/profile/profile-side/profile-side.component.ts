import { Component, Input, OnInit } from '@angular/core'
import { ProfileState } from '../../../store/profile/profile.reducer'
import { initialProfileState } from '../profile.component'

@Component({
    selector: 'app-profile-side',
    templateUrl: './profile-side.component.html',
    styleUrls: ['./profile-side.component.less', '../profile.component.less'],
})
export class ProfileSideComponent implements OnInit {
    constructor() {}

    // @Input() isMyProfile: boolean = false

    ngOnInit(): void {}
}
