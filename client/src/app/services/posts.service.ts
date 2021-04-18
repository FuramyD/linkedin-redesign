import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { IPost } from '../../../../server/src/interfaces/post/post'
import { environment } from '../../environments/environment'
import { PostDto } from '../../../../server/src/dto/post.dto'
import { CommentDto } from '../../../../server/src/dto/comment.dto'
import { IComment } from '../../../../server/src/interfaces/post/comment'

@Injectable({
    providedIn: 'root',
})
export class PostsService {
    constructor(private http: HttpClient) {}

    createPost(post: PostDto): Observable<IPost> {
        // console.log('service request [POST]:', post)
        return this.http.post<IPost>(
            `${environment.server_url}/posts/create`,
            post,
        )
    }

    editPost(content: string, postId: number): void {}
    removePost(postId: number): void {}

    likePost(postId: number, userId: number): Observable<{ like: boolean }> {
        return this.http.post<{ like: boolean }>(
            `${environment.server_url}/posts/like/${postId}`,
            { id: userId },
        )
    }

    dontLikePost(
        postId: number,
        userId: number,
    ): Observable<{ like: boolean }> {
        return this.http.post<{ like: boolean }>(
            `${environment.server_url}/posts/dont-like/${postId}`,
            { id: userId },
        )
    }

    createComment(comment: CommentDto, postId: number): Observable<IComment[]> {
        return this.http.post<IComment[]>(
            `${environment.server_url}/posts/${postId}/comments/add`,
            comment,
        )
    }

    editComment(postId: number, commentId: number, content: string): void {}
    removeComment(postId: number, commentId: number): void {}

    likeComment(
        postId: number,
        commentId: number,
        userId: number,
    ): Observable<{ like: boolean }> {
        return this.http.post<{ like: boolean }>(
            `${environment.server_url}/${postId}/comments/like/${commentId}`,
            { id: userId },
        )
    }
    dontLikeComment(
        postId: number,
        commentId: number,
        userId: number,
    ): Observable<{ like: boolean }> {
        return this.http.post<{ like: boolean }>(
            `${environment.server_url}/${postId}/comments/dont-like/${commentId}`,
            { id: userId },
        )
    }

    getPosts(id: string | number): Observable<{ posts: IPost[] }> {
        return this.http.get<{ posts: IPost[] }>(
            `${environment.server_url}/posts/${id}`,
        )
    }
}
