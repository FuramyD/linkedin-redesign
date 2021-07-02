import { createFeatureSelector, createSelector } from '@ngrx/store'
import {
    chatNode,
    ChatState,
    selectAllChats,
    selectChatEntities,
    selectChatIds,
    selectChatTotal,
} from './chat.reducer'

export const chatFeatureSelector = createFeatureSelector<ChatState>(chatNode)

export const allChatsSelector = createSelector(
    chatFeatureSelector,
    selectAllChats,
)

export const chatIdsSelector = createSelector(
    chatFeatureSelector,
    selectChatIds,
)

export const currentChatIdSelector = createSelector(
    chatFeatureSelector,
    state => state.currentChat,
)

export const chatTotalSelector = createSelector(
    chatFeatureSelector,
    selectChatTotal,
)

export const chatEntitiesSelector = createSelector(
    chatFeatureSelector,
    selectChatEntities,
)

export const currentChatSelector = createSelector(
    chatEntitiesSelector,
    currentChatIdSelector,
    (chatEntities, chatId) => {
        if (chatId === null) return null
        return chatEntities[chatId]
    },
)

export const messagesSelector = createSelector(
    chatFeatureSelector,
    state => state.messages,
)

export const lastMessageSelector = createSelector(
    chatFeatureSelector,
    state => {},
)

export const messagesSelector1 = createSelector(
    chatEntitiesSelector,
    currentChatIdSelector,
    (chatEntities, chatId) => {
        if (!chatId && chatId !== 0) return []
        return chatEntities[chatId]?.chat.messages
    },
)
