import {Body, Controller, Get, Post, Req, Res} from '@nestjs/common'
import { UsersService } from './users.service'
import { Request, Response } from 'express'
import {CreateUserDto} from "../dto/createUserDto";

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post('add-new')
    addUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
        console.log(createUserDto)
    }
}
