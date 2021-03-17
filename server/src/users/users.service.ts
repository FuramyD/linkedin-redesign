import { Injectable } from '@nestjs/common'
import { CreateUserDto } from '../dto/createUserDto'
import { Observable } from 'rxjs'
import { IUser } from '../interfaces/user'
import { AuthDto } from '../dto/authDto'

@Injectable()
export class UsersService {
    users: IUser[] = []
    nextId: number = 0

    createUser(user: CreateUserDto | IUser): CreateUserDto | null {
        if (
            this.users.some(
                USER => user.email === USER.email || user.phone === USER.phone,
            )
        ) {
            return null
        }
        this.users.push({
            id: this.nextId++,
            ...user,
            info: {
                views: {
                    current: 0,
                    prev: 0,
                },
                posts: [],
            },
        } as IUser)

        return user
    }

    authUser(authData: AuthDto): IUser | null {
        const user: IUser | undefined = this.users.find(
            user =>
                user.email === authData.email &&
                user.password === authData.password,
        )
        if (user) {
            user.info.isOnline = true
            return user
        }
        return null
    }

    findUserById(id: number): IUser | null {
        console.log('ID =>>', id)
        const user: IUser | undefined = this.users.find(user => user.id === id)
        if (user) return user
        return null
    }

    removeUser(id: number): IUser | null {
        const user: IUser | undefined = this.users.find(user => user.id === id)
        if (!user) return null
        this.users = this.users.filter(user => user.id !== id)
        return user
    }

    findAllUsers(): IUser[] {
        return this.users
    }
}
