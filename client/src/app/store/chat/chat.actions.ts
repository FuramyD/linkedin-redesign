import { Action } from '@ngrx/store'
import { IMessage } from '../../interfaces/chat/message'
import { IChat } from '../../interfaces/chat/chat'
import { IUser } from '../../interfaces/user'
import { Chat } from './chat.reducer'
import { IMessages } from '../../interfaces/chat/messages'
import { Update } from '@ngrx/entity'

export const RECEIVE_MESSAGE = '[CHAT] receive msg'
export const RECEIVE_MESSAGE_SUCCESS = '[CHAT] receive msg success'

export const READ_MESSAGES = '[CHAT] read messages'

export const LOAD_CHATS = '[CHAT] load chats'
export const LOAD_CHATS_SUCCESS = '[CHAT] load chats success'

export const CHANGE_CURRENT_CHAT = '[CHAT] change current chat'

export const GET_CURRENT_BUDDY = '[CHAT] get current buddy'
export const GET_CURRENT_BUDDY_SUCCESS = '[CHAT] get current buddy success'

export const GET_CURRENT_CHAT = '[CHAT] get current chat'
export const GET_CURRENT_CHAT_SUCCESS = '[CHAT] get current chat success'

export const GET_CURRENT_CHAT_FAILED = '[CHAT] get current chat failed'

export class ReceiveMessageAction implements Action {
    readonly type = RECEIVE_MESSAGE
    constructor(
        public payload: {
            chatId: number
            messages: IMessages[]
        },
    ) {}
}

export class LoadChatsAction implements Action {
    readonly type = LOAD_CHATS
    constructor(public payload: { profileId: number }) {}
}

export class LoadChatsSuccessAction implements Action {
    readonly type = LOAD_CHATS_SUCCESS
    constructor(
        public payload: {
            chats: Chat[]
        },
    ) {}
}

export class ChangeCurrentChatAction implements Action {
    readonly type = CHANGE_CURRENT_CHAT
    constructor(public payload: { id: number | string }) {}
}

export class GetCurrentChatFailedAction implements Action {
    readonly type = GET_CURRENT_CHAT_FAILED
    constructor(public payload: { error: string }) {}
}

export class ReadMessageAction {
    readonly type = READ_MESSAGES
    constructor(
        public payload: {
            chatId: number
            messages: IMessages[]
        },
    ) {}
}

export type ChatActions =
    | ReceiveMessageAction
    | LoadChatsAction
    | LoadChatsSuccessAction
    | GetCurrentChatFailedAction
    | ChangeCurrentChatAction
    | ReadMessageAction
