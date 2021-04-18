import { Injectable } from '@nestjs/common'
import { IComment } from '../interfaces/post/comment'
import { IPost } from '../interfaces/post/post'
import { PostDto } from '../dto/post.dto'
import { CommentDto } from '../dto/comment.dto'
import { EditableDto } from '../dto/editable.dto'

@Injectable()
export class PostsService {
    posts: IPost[] = []
    currentPostId: number = 0
    currentCommentId: number = 0

    createPost(post: PostDto) {
        const POST = {
            id: this.currentPostId++,
            creator: post.creator,
            content: post.content,
            dateOfCreation: post.dateOfCreation,
            attached: post.attached,

            comments: [],
            likes: [],
        }
        this.posts.unshift(POST)

        return POST
    }

    editPost(editablePost: EditableDto): IPost | null {
        const post = this.posts.find(post => post.id === editablePost.id)
        if (post) {
            post.content = editablePost.newContent
            post.dateOfLastModify = Date.now()

            return post
        }
        return null
    }

    findPost(id: number): IPost | undefined {
        return this.posts.find(post => post.id === id)
    }

    findAllPosts(): IPost[] {
        return this.posts
    }

    removePost(id: number): boolean {
        this.posts = this.posts.filter(post => post.id !== id)
        return true
    }

    likePost(postId: number, userId: number): boolean {
        const post = this.posts.find(post => post.id === postId)
        if (post) {
            const isLike = post.likes.some(like => like.userId === userId)

            if (!isLike) {
                post.likes.push({ userId })
                return true
            }
        }
        return false
    }

    dontLikePost(postId: number, userId: number): boolean {
        const post = this.posts.find(post => post.id === postId)
        if (post) {
            post.likes = post.likes.filter(like => like.userId !== userId)
            return true
        }
        return false
    }

    addComment(postId: number, comment: CommentDto): IComment[] | null {
        const post = this.posts.find(post => post.id === postId)
        if (post) {
            post.comments.push({
                id: this.currentCommentId++,
                likes: [],
                ...comment,
            })

            return post.comments
        }
        return null
    }

    editComment(postId: number, editableComment: EditableDto): CommentDto[] | null {
        const post = this.posts.find(post => post.id === postId)
        if (post) {
            const comment = post.comments.find(comment => comment.id === editableComment.id)
            if (comment) {
                comment.content = editableComment.newContent
                comment.dateOfLastModify = Date.now()

                return post.comments
            }
        }
        return null
    }

    removeComment(postId: number, commentId: number): boolean {
        const post = this.posts.find(post => post.id === postId)
        if (post) {
            post.comments = post.comments.filter(comment => comment.id !== commentId)
            return true
        }
        return false
    }

    likeComment(postId: number, commentId: number, userId: number): boolean {
        const post = this.posts.find(post => post.id === postId)
        if (post) {
            const comment = post.comments.find(comment => comment.id === commentId)
            if (comment) {
                const isLike = comment.likes.some(like => like.userId === userId)

                if (!isLike) {
                    comment.likes.push({ userId })
                    return true
                }
            }
        }
        return false
    }

    dontLikeComment(postId: number, commentId: number, userId: number): boolean {
        const post = this.posts.find(post => post.id === postId)
        if (post) {
            const comment = post.comments.find(comment => comment.id === commentId)
            if (comment) {
                comment.likes = comment.likes.filter(like => like.userId !== userId)
                return true
            }
        }
        return false
    }
}
