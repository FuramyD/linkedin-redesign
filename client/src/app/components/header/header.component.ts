import { Component, OnInit } from '@angular/core'
import { ProfileService } from '../../services/profile.service'

import { IProfile } from '../../interfaces/profile'
import { IRoute } from '../../interfaces/route'

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less'],
})
export class HeaderComponent implements OnInit {
    profileInfo: IProfile

    constructor(private profileService: ProfileService) {
        this.profileInfo = profileService.getProfileInfo()
    }

    routes: IRoute[] = [
        { path: '/feed', icon: 'feed', name: 'feed' },
        { path: '/network', icon: 'network', name: 'network' },
        { path: '/jobs', icon: 'jobs', name: 'jobs' },
        { path: '/chat', icon: 'chat', name: 'chat' },
        { path: '/notices', icon: 'notices', name: 'notices' },
    ]

    location: Location = location

    ngOnInit(): void {}
}
