import { IAttach } from '../post/attach'
import { IMessages } from './messages'

export interface IChat {
    userId: number
    attached: IAttach[]
    messages: IMessages[]
}
