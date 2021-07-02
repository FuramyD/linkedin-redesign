import { Injectable } from '@angular/core'

import * as io from 'socket.io-client'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'

@Injectable({
    providedIn: 'root',
})
export class WebSocketService {
    private socket: SocketIOClient.Socket

    constructor() {
        this.socket = io(environment.server_url, {
            transports: ['websocket', 'polling'],
        })
    }

    listen<T>(eventName: string): Observable<T> {
        return new Observable(subscriber => {
            this.socket.on(eventName, (data: T) => {
                subscriber.next(data)
            })
        })
    }

    emit<T>(eventName: string, data: T): void {
        this.socket.emit(eventName, data)
    }
}
