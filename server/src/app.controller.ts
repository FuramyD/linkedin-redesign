import { Controller, Get, Param, Res } from '@nestjs/common'
import { AppService } from './app.service'
import { Response } from 'express'

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('uploads/:fileName')
    getFile(@Param() param: { fileName: string }, @Res() res: Response): void {
        res.sendFile(param.fileName, { root: 'src/uploads' })
    }
}
