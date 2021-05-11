import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'app-chat-side',
    templateUrl: './chat-side.component.html',
    styleUrls: ['./chat-side.component.less'],
})
export class ChatSideComponent implements OnInit {
    constructor() {}

    unread = [1]

    activeChat: string = ''

    activateChat(e: MouseEvent, chatList: HTMLElement): void {
        if (e.target === chatList) return

        const element = (e.target as HTMLElement).closest('.chat')
        const chats = Array.from(chatList.children)

        chats.forEach(chat => chat.classList.remove('active'))
        element?.classList.add('active')

        this.activeChat = element?.querySelector('.name')?.textContent ?? ''
        console.log(this.activeChat)
    }

    ngOnInit(): void {}
}
