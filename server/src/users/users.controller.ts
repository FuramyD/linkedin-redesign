import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Res } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from '../dto/create-user.dto'
import { AuthDto } from '../dto/auth.dto'
import { Response } from 'express'
import { SendConnectionDto } from '../dto/send-connection.dto'

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post('create')
    async createUser(@Body() body: CreateUserDto, @Res() res: Response): Promise<void> {
        const user = await this.usersService.createUser(body)
        if (user) {
            res.status(HttpStatus.CREATED).send({ user })
            return
        }
        res.status(HttpStatus.CONFLICT).send({
            error: 'A user with the same email or phone number already exists',
        })
    }

    @Post('auth')
    async authUser(@Body() body: AuthDto, @Res() res: Response): Promise<void> {
        const user = await this.usersService.authUser(body)
        if (user) {
            res.status(HttpStatus.OK).send({ user })
        } else res.status(HttpStatus.CONFLICT).send({ error: 'User is not found' })
    }

    @Get('find/:id')
    async findUserById(@Param() param, @Res() res: Response): Promise<void> {
        if (param.id === 'all') {
            const users = await this.usersService.findAllUsers()
            res.status(HttpStatus.OK).send({ users })
            return
        }

        if (param.id.match(/,/)) {
            const users = await this.usersService.findUsersById(param.id)
            if (users) res.status(HttpStatus.OK).send({ users })
            else res.status(HttpStatus.CONFLICT).send({ error: 'Users not found' })
            return
        }

        const user = await this.usersService.findUserById(+param.id)
        if (user) res.status(HttpStatus.OK).send({ user })
        else res.status(HttpStatus.CONFLICT).send({ error: 'User is not found' })
    }

    @Delete('remove/:id')
    async removeUser(@Param() param, @Res() res: Response): Promise<void> {
        const user = await this.usersService.removeUser(+param.id)
        if (user) res.status(HttpStatus.OK).send({ user })
        else res.status(HttpStatus.CONFLICT).send({ error: 'User is not found' })
    }

    @Post('connections/send/:id') // :id - userId
    async sendConnection(@Param() param, @Body() data: SendConnectionDto, @Res() res: Response): Promise<void> {
        const { sent } = await this.usersService.sendConnection(data.senderId, +param.id, data.message)
        if (sent) res.status(HttpStatus.OK).send({ sent })
        else res.status(HttpStatus.CONFLICT).send({ sent })
    }

    @Post('connections/accept/:id') // :id - senderId
    async acceptConnection(@Param() param, @Body() data: { userId: number; date: number }, @Res() res: Response): Promise<void> {
        const result = await this.usersService.acceptConnection(+param.id, data.userId, data.date)
        if (result && result.user) res.status(HttpStatus.OK).send({ user: result.user, chatId: result.chatId })
        else res.status(HttpStatus.OK).send({ error: `User with id: ${param.id} is not found` })
    }

    @Post('connections/decline/:id') // :id - senderId
    async declineConnection(@Param() param, @Body() data: { userId: number }, @Res() res: Response): Promise<void> {
        const user = this.usersService.declineConnection(+param.id, data.userId)
        if (user) res.status(HttpStatus.OK).send(user)
        else res.status(HttpStatus.OK).send({ error: `User with id: ${param.id} is not found` })
    }

    @Post('connections/remove/:id') // :id - senderId
    async removeConnection(@Param() param, @Body() data: { userId: number }, @Res() res: Response): Promise<void> {
        const user = this.usersService.removeConnection(+param.id, data.userId)
        if (user) res.status(HttpStatus.OK).send(user)
        else res.status(HttpStatus.OK).send({ error: `User with id: ${param.id} is not found` })
    }

    @Get('usss')
    getTest(): string {
        const users = this.usersService.findAllUsers()
        return JSON.stringify(users)
    }

    @Get('connections/clear/:id')
    clearConnections(@Param() param, @Res() res: Response): void {
        this.usersService.clearConnections(+param.id).then(r => console.log(r))
        res.send({ msg: 'success' })
    }
}
