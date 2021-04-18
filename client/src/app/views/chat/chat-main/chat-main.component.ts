import { Component, OnInit } from '@angular/core'
import { ChatService } from '../../../services/chat.service'

@Component({
    selector: 'app-chat-main',
    templateUrl: './chat-main.component.html',
    styleUrls: ['./chat-main.component.less'],
})
export class ChatMainComponent implements OnInit {
    constructor(private chatService: ChatService) {}

    buddy = {
        isOnline: false,
        lastOnline: Date.now() - 60 * 60 * 5,
    }

    Date = Date

    messageContent: string = ''

    messages = [
        {
            type: 'in',
            content: 'Hello!',
            time: Date.now(),
            status: 'sent',
        },
        {
            type: 'in',
            content: 'How do you do?',
            time: Date.now(),
            status: 'sent',
        },
        {
            type: 'out',
            content: 'Hello, my friend!',
            time: Date.now(),
            status: 'read',
        },
        {
            type: 'out',
            content: "I'm fine, thank you)",
            time: Date.now(),
            status: 'read',
        },
        {
            type: 'out',
            content: 'And you?',
            time: Date.now(),
            status: 'read',
        },
    ]

    sendMessage(): void {
        this.chatService.sendMessage(this.messageContent)
    }

    dateParser(now: number, last: number): string {
        const deltaSec = (now - last) / 1000
        const secondsPerDay = 60 * 60 * 24
        const secondsPerHour = 60 * 60
        const secondsPerMinute = 60

        if (deltaSec > secondsPerDay) {
            const days = Math.floor(deltaSec / secondsPerDay)
            if (days < 2) return 'day ago'
            return Math.floor(deltaSec / secondsPerDay) + ' days ago'
        } else if (deltaSec > secondsPerHour) {
            const hours = Math.floor(deltaSec / secondsPerDay)
            if (hours < 2) return 'hour ago'
            return Math.floor(deltaSec / secondsPerHour) + ' hours ago'
        } else if (deltaSec > secondsPerMinute) {
            const minutes = Math.floor(deltaSec / secondsPerDay)
            if (minutes < 2) return 'minute ago'
            return Math.floor(deltaSec / secondsPerMinute) + ' minutes ago'
        } else return 'minute ago'
    }

    ngOnInit(): void {}
}
