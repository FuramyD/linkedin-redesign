import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersService } from './users/users.service'
import { UsersController } from './users/users.controller'

@Module({
    imports: [],
    controllers: [AppController, UsersController],
    providers: [AppService, UsersService],
})
export class AppModule {}
