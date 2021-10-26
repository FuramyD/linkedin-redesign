import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";
import {existsSync, mkdirSync} from "fs";
import {resolve} from "path";

const uploadsPath = resolve(__dirname, '..', '..', 'src', 'uploads')

@Injectable()
export class UploadsInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<void>): Observable<void> {
        existsSync(uploadsPath) || mkdirSync(uploadsPath, {recursive: true})
        return next.handle()
    }
}