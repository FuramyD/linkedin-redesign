import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { ChatComponent } from './chat.component'
import { ChatMainComponent } from './chat-main/chat-main.component'
import { ChatSideComponent } from './chat-side/chat-side.component'
import { FormsModule } from '@angular/forms'
import { SvgIconModule } from '../../svg-icon/svg-icon.module'
import { ChatService } from '../../services/chat.service'

@NgModule({
    declarations: [ChatComponent, ChatMainComponent, ChatSideComponent],
    imports: [CommonModule, FormsModule, SvgIconModule],
    providers: [ChatService],
})
export class ChatModule {}
