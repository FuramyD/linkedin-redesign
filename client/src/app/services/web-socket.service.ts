import { Injectable } from '@angular/core'

import { io } from 'socket.io-client'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { Socket } from 'ngx-socket-io'

@Injectable({
    providedIn: 'root',
})
export class WebSocketService {
    constructor(private socket: Socket) {
        // this.socket = io(environment.server_url)
    }

    listen<T>(eventName: string): Observable<T> {
        return new Observable(subscriber => {
            this.socket.on(eventName, (data: T) => {
                subscriber.next(data)
            })
        })
    }

    emit(eventName: string, data: any): void {
        this.socket.emit(eventName, data)
    }
}
