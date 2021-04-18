import { IAttach } from '../post/attach'

export interface IMessage {
    id: number
    senderId: number
    content: string
    time: number
    status: string
    attached?: IAttach[]
}
