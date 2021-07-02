import { IChat } from '../../interfaces/chat/chat'
import { IUser } from '../../interfaces/user'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import {
    CHANGE_CURRENT_CHAT,
    ChatActions,
    LOAD_CHATS_SUCCESS,
    READ_MESSAGES,
    RECEIVE_MESSAGE,
} from './chat.actions'
import { IMessages } from '../../interfaces/chat/messages'

export const chatNode = 'chat'

export interface Chat1 {
    chats: IChat[]
    currentChat: IChat | null
    currentBuddy: IUser | null
}

export interface Chat {
    chat: IChat
    buddy: IUser
}

export interface ChatState extends EntityState<Chat> {
    currentChat: number | null
    messages: IMessages[]
}

export const adapter: EntityAdapter<Chat> = createEntityAdapter<Chat>({
    selectId: instance => instance.chat.chatId,
})

export const initialState: ChatState = adapter.getInitialState({
    currentChat: null,
    messages: [],
})

export const chatReducer = (state = initialState, action: ChatActions) => {
    switch (action.type) {
        case LOAD_CHATS_SUCCESS:
            if (state.currentChat !== -1) {
                const curChat = action.payload.chats.find(
                    c => c.chat.chatId === state.currentChat,
                )
                if (curChat) {
                    return {
                        ...adapter.setAll(action.payload.chats, state),
                        messages: curChat.chat.messages,
                    }
                }
            }
            return adapter.setAll(action.payload.chats, state)
        case CHANGE_CURRENT_CHAT:
            return {
                ...state,
                currentChat: action.payload.id,
                messages: state.entities[action.payload.id]?.chat.messages,
            }
        case RECEIVE_MESSAGE:
            if (action.payload.chatId === state.currentChat) {
                return {
                    ...state,
                    messages: action.payload.messages,
                }
            }
            return state
        case READ_MESSAGES:
            return {
                ...state,
                messages: action.payload.messages,
            }
        default:
            return state
    }
}

const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
} = adapter.getSelectors()

export const selectChatIds = selectIds
export const selectChatEntities = selectEntities
export const selectAllChats = selectAll
export const selectChatTotal = selectTotal
