import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NextFunction, Request, Response } from 'express'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.enableCors()

    await app.listen(3000)
}
bootstrap()
