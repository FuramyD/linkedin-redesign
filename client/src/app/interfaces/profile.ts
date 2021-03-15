export interface IProfile {
    name: string
    dateOfBirth: Date
    avatar: string
    viewsInfo: {
        viewsProfile: number
        viewsProfileYesterday: number
        viewsProgress: () => number
        trendingIcon: () => string
    }
}
