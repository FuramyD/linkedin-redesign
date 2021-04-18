import { IAttach } from '../post/attach'
import { IMessages } from './messages'

export interface IChat {
    chatId: number
    users: { userId: number }[]
    attached: IAttach[]
    messages: IMessages[]
}
