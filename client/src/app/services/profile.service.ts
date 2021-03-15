import { Injectable } from '@angular/core'

import { IProfile } from '../interfaces/profile'

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    constructor() {}

    private profileInfo: IProfile = {
        name: 'Alexander Kazantsev',
        dateOfBirth: new Date(2001, 2, 26),
        avatar: '../../assets/img/avatar.jpg',
        viewsInfo: {
            viewsProfile: 299,
            viewsProfileYesterday: 299,
            viewsProgress(): number {
                return this.viewsProfile - this.viewsProfileYesterday
            },
            trendingIcon(): string {
                if (this.viewsProgress() < 0) {
                    return 'trendingDown'
                }
                if (this.viewsProgress() > 0) {
                    return 'trendingUp'
                }
                return 'trendingFlat'
            },
        },
    }

    public getProfileInfo(): IProfile {
        return this.profileInfo
    }
}
