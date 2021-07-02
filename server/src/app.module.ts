import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersController } from './users/users.controller'
import { UsersService } from './users/users.service'
import { PostsController } from './posts/posts.controller'
import { PostsService } from './posts/posts.service'
import { ChatGateway } from './chats/chat.gateway'
import { MongooseModule } from '@nestjs/mongoose'
import { PostSchema } from './posts/post.schema'
import { UserSchema } from './users/user.shema'
import { ChatSchema } from './chats/chat.shema'
import { ChatsService } from './chats/chats.service'
import { ChatsController } from './chats/chats.controller'

@Module({
    imports: [
        MongooseModule.forRoot('mongodb+srv://Furamy:linkedin123@cluster0.j7jfm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'),
        MongooseModule.forFeature([
            { name: 'posts', schema: PostSchema },
            { name: 'users', schema: UserSchema },
            { name: 'chats', schema: ChatSchema },
        ]),
    ],
    controllers: [AppController, UsersController, PostsController, ChatsController],
    providers: [AppService, PostsService, UsersService, ChatGateway, ChatsService],
})
export class AppModule {}
