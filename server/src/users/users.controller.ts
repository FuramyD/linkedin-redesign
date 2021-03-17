import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Res,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { CreateUserDto } from '../dto/createUserDto'
import { UsersService } from './users.service'
import { Response } from 'express'
import { AuthDto } from '../dto/authDto'

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post('create')
    createUser(@Body() body: CreateUserDto, @Res() res: Response) {
        const user = this.usersService.createUser(body)
        if (user) {
            res.status(HttpStatus.CREATED).send({ user })
            return
        }
        res.status(HttpStatus.CONFLICT).send({
            error: 'A user with the same email or phone number already exists',
        })
    }

    @Post('auth')
    authUser(@Body() body: AuthDto, @Res() res: Response): void {
        const user = this.usersService.authUser(body)
        if (user) res.status(HttpStatus.OK).send({ user })
        else
            res.status(HttpStatus.CONFLICT).send({ error: 'User is not found' })
    }

    @Get('find/:id')
    findUserById(@Param() param, @Res() res: Response): void {
        if (param.id === 'all') {
            const users = this.usersService.findAllUsers()
            res.status(HttpStatus.OK).send({ users: users })
        } else {
            const user = this.usersService.findUserById(+param.id)
            if (user) res.status(HttpStatus.OK).send({ user })
            else
                res.status(HttpStatus.CONFLICT).send({
                    error: 'User is not found',
                })
        }
    }

    @Delete('remove/:id')
    removeUser(@Param() param, @Res() res: Response): void {
        const user = this.usersService.removeUser(+param.id)
        if (user) res.status(HttpStatus.OK).send({ user })
        else
            res.status(HttpStatus.CONFLICT).send({ error: 'User is not found' })
    }

    @Get('usss')
    getTest(): string {
        const users = this.usersService.findAllUsers()
        return JSON.stringify(users)
    }
}
