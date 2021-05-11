import { Injectable } from '@angular/core'

import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Observable, of } from 'rxjs'
import { AuthState } from '../store/auth/auth.reducer'
import { IUser } from '../interfaces/user'
import { map } from 'rxjs/operators'
import { IPersonalInfo } from '../interfaces/edit-profile/personalInfo'
import {IContact} from "../interfaces/contact";
import {IProject} from "../interfaces/project";
import {IExp} from "../interfaces/exp";
import {IUniversity} from "../interfaces/university";

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    constructor(private http: HttpClient) {}

    getProfileInfo<T>(id: number | string): Observable<T> {
        return this.http.get<T>(`${environment.server_url}/users/find/${id}`)
    }

    getConnectionsById$(
        connections: { userId: number; date: number }[],
    ): Observable<{ user: IUser; date: number }[]> {
        const identifiers = connections.map(connection => connection.userId)
        if (identifiers.length > 1) {
            return this.getProfileInfo<{ users: IUser[] }>(
                identifiers.join(','),
            ).pipe(
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
        } else if (identifiers.length === 1) {
            return this.getProfileInfo<{ user: IUser }>(
                identifiers.join(','),
            ).pipe(
                map(res => {
                    return connections.map(connection => {
                        return {
                            user: res.user,
                            date: connection.date,
                        }
                    })
                }),
            )
        } else {
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

    editPersonalInfo(info: IPersonalInfo, id: number): Observable<any> {
        return this.http.post(
            `${environment.server_url}/users/find/${id}/edit/profile-info`,
            info,
        )
    }

    changeAvatar(
        fileToUpload: File,
        id: number,
    ): Observable<{ message: string; url: string }> {
        const formData: FormData = new FormData()
        formData.append('avatar', fileToUpload, fileToUpload.name)
        return this.http.post<{ message: string; url: string }>(
            `${environment.server_url}/users/${id}/avatar/upload`,
            formData,
        )
    }

    deleteAvatar(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(
            `${environment.server_url}/users/${id}/avatar/delete`,
        )
    }

    changeEmail(id: number, email: string): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(
            `${environment.server_url}/users/${id}/change/email`,
            { email },
        )
    }
    changePhone(id: number, phone: string): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(
            `${environment.server_url}/users/${id}/change/phone`,
            { phone },
        )
    }
    changePassword(
        id: number,
        newPassword: string,
        oldPassword: string,
    ): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(
            `${environment.server_url}/users/${id}/change/password`,
            { oldPassword, newPassword },
        )
    }

    deleteAccount(userId: number, password: string): Observable<any> {
        return this.http.post(
            `${environment.server_url}/users/remove/${userId}`,
            { password },
        )
    }

    changeRole(role: string, id: number): Observable<any> {
        return this.http.post(`${environment.server_url}/users/${id}/change/role`, { role })
    }
    changeCompany(company: any, id: number): Observable<any> {
        return this.http.post(`${environment.server_url}/users/${id}/change/company`, { company })
    }
    changeAbout(about: string, id: number): Observable<any> {
        return this.http.post(`${environment.server_url}/users/${id}/change/about`, { about })
    }
    changeProfession(profession: string, id: number): Observable<any> {
        return this.http.post(`${environment.server_url}/users/${id}/change/profession`, { profession })
    }
    changeLocality(locality: { country: string; city: string }, id: number): Observable<any> {
        return this.http.post(`${environment.server_url}/users/${id}/change/locality`, { locality })
    }
    changeContactInfo(contactInfo: IContact[], id: number): Observable<any> {
        return this.http.post(`${environment.server_url}/users/${id}/change/contact-info`, { contactInfo })
    }
    changeProjects(projects: IProject[], id: number): Observable<any> {
        return this.http.post(`${environment.server_url}/users/${id}/change/projects`, { projects })
    }
    changeExperience(experience: IExp[], id: number): Observable<any> {
        return this.http.post(`${environment.server_url}/users/${id}/change/experience`, { experience })
    }
    changeEducation(education: IUniversity[], id: number): Observable<any> {
        return this.http.post(`${environment.server_url}/users/${id}/change/education`, { education })
    }
}
