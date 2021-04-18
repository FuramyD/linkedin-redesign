import { IChat } from '../../interfaces/chat/chat'
import { ChatActions, RECEIVE_MESSAGE } from './chat.actions'

export interface ChatState {
    chats: IChat[]
}

const initialState: ChatState = {
    chats: [],
}

export const chatReducer = (
    state: ChatState = initialState,
    action: ChatActions,
) => {
    let oldChat
    switch (action.type) {
        case RECEIVE_MESSAGE:
            oldChat = state.chats.find(
                chat => chat.userId === action.payload.senderId,
            )
            return {
                ...state,
                chats: [
                    {
                        userId: action.payload.senderId,
                        attached: [
                            ...(oldChat as IChat).attached,
                            ...(action.payload.content.attached || []),
                        ],
                        messages: [
                            ...(oldChat?.messages ?? []),
                            ...(((oldChat?.messages ?? []).some(msg => {
                                const day = new Date().toDateString()
                                return msg.day === day
                            }) &&
                                (oldChat?.messages ?? []).map(msg => {
                                    const day = new Date().toDateString()
                                    if (msg.day === day) {
                                        return {
                                            day,
                                            dayMessages: [
                                                ...msg.dayMessages,
                                                action.payload.content,
                                            ],
                                        }
                                    }
                                    return msg
                                })) || [
                                {
                                    day: new Date().toDateString(),
                                    dayMessages: [action.payload.content],
                                },
                            ]),
                        ],
                    },
                    ...state.chats,
                ],
            }
        default:
            return state
    }
}
