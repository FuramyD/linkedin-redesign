import { IProfileInfo } from './profileInfo'

export interface IUser {
    id: number | string

    firstName: string
    lastName: string
    email: string
    phone: string
    password: string

    info: IProfileInfo
}
