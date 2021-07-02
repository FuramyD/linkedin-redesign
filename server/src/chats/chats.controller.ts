import { Controller, Get, HttpStatus, Param, Query, Res } from '@nestjs/common'
import { Response } from 'express'
import { ChatsService } from './chats.service'

@Controller('chats')
export class ChatsController {
    constructor(private chatsService: ChatsService) {}

    @Get('find/all')
    async getChats(@Res() res: Response): Promise<void> {
        const chats = await this.chatsService.getChats()
        if (!chats) return
        if (chats[0]) res.status(HttpStatus.OK).send({ chats })
        if (!chats[0]) res.status(HttpStatus.NOT_FOUND).send({ error: `No chat was found` })
    }

    @Get('find/:id')
    async getChat(@Param() param: { id: string }, @Res() res: Response): Promise<void> {
        const chat = await this.chatsService.getChat(+param.id)
        if (chat) res.status(HttpStatus.OK).send({ chat })
        if (!chat) res.status(HttpStatus.NOT_FOUND).send({ error: `chat with id: ${param.id} not found` })
    }

    @Get('delete/all')
    async deleteAll() {
        await this.chatsService.deleteAll()
    }

    @Get('delete/:id')
    async deleteOne(@Param() param: { id: string }) {
        await this.chatsService.deleteOne(+param.id)
    }
}
