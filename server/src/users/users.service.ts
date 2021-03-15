import { Injectable } from '@nestjs/common'
import { IUser } from '../interfaces/user'

@Injectable()
export class UsersService {
    users: IUser[]

    addNewUser(user: IUser): void {
        this.users.push(user)
    }

    removeUser(id: number | string): string | null {
        let removedUser = this.users.filter(user => user.id !== id)
        if (removedUser) return 'removed success'
        return null
    }
}
