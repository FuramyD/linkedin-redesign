import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common'
import { Express, Request } from 'express'
import { UsersService } from './users.service'
import { CreateUserDto } from '../dto/create-user.dto'
import { AuthDto } from '../dto/auth.dto'
import { Response } from 'express'
import { SendConnectionDto } from '../dto/send-connection.dto'
import { IPersonalInfo } from '../interfaces/edit-profile/personalInfo'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { IContact } from '../interfaces/contact'
import { IProject } from '../interfaces/project'
import { IExp } from '../interfaces/exp'
import { IUniversity } from '../interfaces/university'
import { ILocality } from '../interfaces/locality'
import {UploadsInterceptor} from "../interceptors/uploads.interceptor";

const storage = diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'src/uploads')
    },
    filename(req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void): void {
        callback(null, file.fieldname + '_' + Date.now() + extname(file.originalname))
    },
})

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
    async findUserById(@Param() param, @Res() res: Response, @Query() query: { fullName?: string }): Promise<void> {
        if (param.id === 'all') {
            const users = await this.usersService.findAllUsers(query)
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

    @Post('remove/:id')
    async removeUser(@Param() param, @Body() data: { password: string }, @Res() res: Response): Promise<void> {
        const isRemoved = await this.usersService.removeUser(+param.id, data.password)
        if (isRemoved) res.status(HttpStatus.OK).send({ message: `Your account has been deleted` })
        else if (isRemoved === null) res.status(HttpStatus.CONFLICT).send({ error: 'User is not found' })
        else if (isRemoved === false) res.status(HttpStatus.CONFLICT).send({ error: 'Wrong password' })
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

    @Get('connections/clear/:id')
    clearConnections(@Param() param, @Res() res: Response): void {
        this.usersService.clearConnections(+param.id).then(r => console.log(r))
        res.send({ msg: 'success' })
    }

    @Post('find/:id/edit/profile-info')
    async editPersonalInfo(@Param() param, @Body() info: IPersonalInfo, @Res() res: Response): Promise<void> {
        const response = await this.usersService.editPersonalInfo(+param.id, info)
        if (response === 'changed') res.status(HttpStatus.OK).send({ status: 'changed', newInfo: info })
        if (response === 'not found') res.status(HttpStatus.NOT_FOUND).send({ status: 'not found' })
    }

    @Post(':id/avatar/upload')
    @UseInterceptors(
        UploadsInterceptor,
        FileInterceptor('avatar', { storage })
    )
    async avatarUpload(
        @UploadedFile() file: Express.Multer.File,
        @Param() param: { id: string },
        @Res() res: Response
    ): Promise<void> {
        const result = await this.usersService.uploadAvatar(file, +param.id)
        if (result)
            res.status(HttpStatus.OK).send({
                message: 'Avatar uploaded successfully',
                url: `http://localhost:3000/uploads/${file.filename}`,
            })
        if (!result) res.status(HttpStatus.CONFLICT).send({ message: 'Avatar not loaded' })
    }

    @Delete(':id/avatar/delete')
    async deleteAvatar(@Param() param: { id: string }, @Res() res: Response): Promise<void> {
        const result = this.usersService.deleteAvatar(+param.id)
        if (result) res.status(HttpStatus.OK).send({ message: 'Avatar has been deleted' })
        if (!result) res.status(HttpStatus.OK).send({ message: 'Avatar has not been deleted' })
    }

    @Get('validate/:id/:fieldName/:value')
    async validateUserBySomething(@Param() param: { id: string; fieldName: string; value: string }, @Res() res: Response) {
        const { id, fieldName, value } = param
        const user = await this.usersService.validateUserBySomething(+id, fieldName, value)

        if (user) res.status(HttpStatus.OK).send(user)
        else res.status(HttpStatus.NOT_FOUND).send({ message: 'User is not found' })
    }

    @Post(':id/change/email')
    async changeEmail(@Param() param: { id: string }, @Body() data: { email: string }, @Res() res: Response): Promise<void> {
        const isChanged = await this.usersService.changeEmail(+param.id, data.email)

        if (isChanged) res.status(HttpStatus.OK).send({ message: 'email has been changed' })
        if (!isChanged) res.status(HttpStatus.NOT_FOUND).send({ message: 'email has not been changed' })
    }

    @Post(':id/change/phone')
    async changePhone(@Param() param: { id: string }, @Body() data: { phone: string }, @Res() res: Response): Promise<void> {
        const isChanged = await this.usersService.changePhone(+param.id, data.phone)

        if (isChanged) res.status(HttpStatus.OK).send({ message: 'phone has been changed' })
        if (!isChanged) res.status(HttpStatus.NOT_FOUND).send({ message: 'phone has not been changed' })
    }

    @Post(':id/change/password')
    async changePassword(
        @Param() param: { id: string },
        @Body() data: { newPassword: string; oldPassword: string },
        @Res() res: Response,
    ): Promise<void> {
        const isChanged = await this.usersService.changePassword(+param.id, data.newPassword, data.oldPassword)

        if (isChanged) res.status(HttpStatus.OK).send({ message: 'password has been changed' })

        if (isChanged === null) {
            res.status(HttpStatus.NOT_FOUND).send({ message: 'incorrect old password' })
            return
        }

        if (!isChanged) res.status(HttpStatus.CONFLICT).send({ message: 'password has not been changed' })
    }

    @Post(':id/change/role')
    async changeRole(@Param() param: { id: string }, @Body() data: { role: string }, @Res() res: Response): Promise<void> {
        const changed = await this.usersService.changeRole(+param.id, data.role)

        if (changed) res.status(HttpStatus.OK).send({ message: 'Role has been changed' })
        else res.status(HttpStatus.CONFLICT).send({ message: 'Role has not been changed, please try again' })
    }

    @Post(':id/change/company')
    async changeCompany(@Param() param: { id: string }, @Body() data: { company: any }, @Res() res: Response): Promise<void> {
        // const changed = await this.usersService.changeCompany(+param.id, data.company)
    }

    @Post(':id/change/about')
    async changeAbout(@Param() param: { id: string }, @Body() data: { about: string }, @Res() res: Response): Promise<void> {
        const changed = await this.usersService.changeAbout(+param.id, data.about)

        if (changed) res.status(HttpStatus.OK).send({ message: 'About has been changed' })
        else res.status(HttpStatus.CONFLICT).send({ message: 'About has not been changed, please try again' })
    }
    @Post(':id/change/profession')
    async changeProfession(@Param() param: { id: string }, @Body() data: { profession: string }, @Res() res: Response): Promise<void> {
        const changed = await this.usersService.changeProfession(+param.id, data.profession)

        if (changed) res.status(HttpStatus.OK).send({ message: 'Profession has been changed' })
        else res.status(HttpStatus.CONFLICT).send({ message: 'Profession has not been changed, please try again' })
    }

    @Post(':id/change/locality')
    async changeLocality(@Param() param: { id: string }, @Body() data: { locality: ILocality }, @Res() res: Response): Promise<void> {
        const changed = await this.usersService.changeLocality(+param.id, data.locality)

        if (changed) res.status(HttpStatus.OK).send({ message: 'Locality has been changed' })
        else res.status(HttpStatus.CONFLICT).send({ message: 'Locality has not been changed, please try again' })
    }

    @Post(':id/change/contact-info')
    async changeContactInfo(
        @Param() param: { id: string },
        @Body() data: { contactInfo: IContact[] },
        @Res() res: Response,
    ): Promise<void> {
        const changed = await this.usersService.changeContactInfo(+param.id, data.contactInfo)

        if (changed) res.status(HttpStatus.OK).send({ message: 'Contact information has been changed' })
        else res.status(HttpStatus.CONFLICT).send({ message: 'Contact information has not been changed, please try again' })
    }

    @Post(':id/change/projects')
    async changeProjects(@Param() param: { id: string }, @Body() data: { projects: IProject[] }, @Res() res: Response): Promise<void> {
        const changed = await this.usersService.changeProjects(+param.id, data.projects)

        if (changed) res.status(HttpStatus.OK).send({ message: 'Projects have been changed' })
        else res.status(HttpStatus.CONFLICT).send({ message: 'Projects have not been changed, please try again' })
    }

    @Post(':id/change/experience')
    async changeExperience(@Param() param: { id: string }, @Body() data: { experience: IExp[] }, @Res() res: Response): Promise<void> {
        const changed = await this.usersService.changeExperience(+param.id, data.experience)

        if (changed) res.status(HttpStatus.OK).send({ message: 'Experience has been changed' })
        else res.status(HttpStatus.CONFLICT).send({ message: 'Experience has not been changed, please try again' })
    }

    @Post(':id/change/education')
    async changeEducation(@Param() param: { id: string }, @Body() data: { education: IUniversity[] }, @Res() res: Response): Promise<void> {
        const changed = await this.usersService.changeEducation(+param.id, data.education)

        if (changed) res.status(HttpStatus.OK).send({ message: 'Education has been changed' })
        else res.status(HttpStatus.CONFLICT).send({ message: 'Education has not been changed, please try again' })
    }

    @Post(':id/ddd')
    async a(@Param() param) {
        console.log('aaaa')
        await this.usersService.a(+param.id)
    }
}
