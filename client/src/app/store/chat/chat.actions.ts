import { Action } from '@ngrx/store'
import { IMessage } from '../../interfaces/chat/message'

export const RECEIVE_MESSAGE = '[CHAT] receive msg'
export const RECEIVE_MESSAGE_SUCCESS = '[CHAT] receive msg success'

export class ReceiveMessageAction implements Action {
    readonly type = RECEIVE_MESSAGE
    constructor(
        public payload: {
            senderId: number
            content: IMessage
        },
    ) {}
}

export type ChatActions = ReceiveMessageAction
