import { Injectable } from '@angular/core'

import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import {Observable, of} from 'rxjs'
import { AuthState } from '../store/auth/auth.reducer'
import { IUser } from '../interfaces/user'
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    constructor(private http: HttpClient) {}

    getProfileInfo<T>(id: number | string): Observable<T> {
        return this.http.get<T>(`${environment.server_url}/users/find/${id}`)
    }

    getConnectionsById$(connections: { userId: number, date: number }[]): Observable<{ user: IUser, date: number }[]> {
        const identifiers = connections.map(connection => connection.userId)
        if (identifiers.length > 1) {
            return this.getProfileInfo<{ users: IUser[] }>(identifiers.join(','))
                .pipe(
                    map(res => {
                        return connections.map(connection => {
                            return {
                                user: res.users.find(
                                    us => us.id === connection.userId,
                                ) as IUser,
                                date: connection.date,
                            }
                        })
                    }),
                )
        }
        else if (identifiers.length === 1) {
            return this.getProfileInfo<{ user: IUser }>(identifiers.join(','))
                .pipe(
                    map(res => {
                        return connections.map(connection => {
                            return {
                                user: res.user,
                                date: connection.date,
                            }
                        })
                    }),
                )
        }
        else {
            console.log('connections is empty')
            return of([])
        }
    }

    sendConnection(
        senderId: number,
        userId: number,
        message: string,
    ): Observable<{ sent: boolean }> {
        return this.http.post<{ sent: boolean }>(
            `${environment.server_url}/users/connections/send/${userId}`,
            {
                senderId,
                message,
            },
        )
    }
    acceptConnection(
        senderId: number,
        userId: number,
        date: number,
    ): Observable<{ user: IUser; chatId: number }> {
        return this.http.post<{ user: IUser; chatId: number }>(
            `${environment.server_url}/users/connections/accept/${senderId}`,
            { userId, date },
        )
    }
    declineConnection(senderId: number, userId: number): Observable<IUser> {
        return this.http.post<IUser>(
            `${environment.server_url}/users/connections/decline/${senderId}`,
            { userId },
        )
    }
    cancelConnection(senderId: number, userId: number): Observable<IUser> {
        return this.http.post<IUser>(
            `${environment.server_url}/users/connections/decline/${senderId}`,
            { userId },
        )
    }
    removeConnection(senderId: number, userId: number): Observable<IUser> {
        return this.http.post<IUser>(
            `${environment.server_url}/users/connections/remove/${senderId}`,
            { userId },
        )
    }
}
