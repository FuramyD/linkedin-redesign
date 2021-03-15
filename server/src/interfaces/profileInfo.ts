import { ILocation } from './location'

export interface IProfileInfo {
    avatar: string | ArrayBuffer | null
    location: ILocation
    views: number
    connections: number

    dateOfLastVisit: Date
    isOnline: boolean
}
