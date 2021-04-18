import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Res } from '@nestjs/common'
import { PostDto } from '../dto/post.dto'
import { CommentDto } from '../dto/comment.dto'
import { EditableDto } from '../dto/editable.dto'
import { PostsService } from './posts.service'
import { Response } from 'express'
import { UsersService } from '../users/users.service'

type ID = string | number

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService, private usersService: UsersService) {}

    @Post('create')
    async createPost(@Body() post: PostDto, @Res() res: Response): Promise<void> {
        console.log('POST:', post)
        const POST = await this.postsService.createPost(post)
        res.status(HttpStatus.CREATED).send(POST)
    }

    @Post('edit')
    async editPost(@Body() editablePost: EditableDto, @Res() res: Response): Promise<void> {
        const editedPost = await this.postsService.editPost(editablePost)
        res.status(HttpStatus.OK).send(editedPost)
    }

    @Get(':id')
    async findPost(@Param() param: { id: number | string }, @Res() res: Response): Promise<void> {
        if (param.id === 'all') {
            const posts = await this.postsService.findAllPosts()
            res.status(HttpStatus.OK).send({ posts })
        } else {
            const post = await this.postsService.findPost(+param.id)
            if (post) res.status(HttpStatus.OK).send(post)
            else
                res.status(HttpStatus.CONFLICT).send({
                    error: `Post with id ${param.id} not found`,
                })
        }
    }

    @Delete('remove/:id')
    async removePost(@Param() param: { id: ID }, @Res() res: Response): Promise<void> {
        const removed = await this.postsService.removePost(+param.id)
        if (removed) res.status(HttpStatus.OK).send({ removed })
        else res.status(HttpStatus.OK).send({ removed: false })
    }

    @Post('like/:id')
    async likePost(@Param() param: { id: ID }, @Body() user: { id: number }, @Res() res: Response): Promise<void> {
        const like = await this.postsService.likePost(+param.id, user.id)
        if (like) res.status(HttpStatus.OK).send({ like: true })
        else
            res.status(HttpStatus.CONFLICT).send({
                error: 'the post has already been liked',
            })
    }

    @Post('dont-like/:id')
    async dontLikePost(@Param() param: { id: ID }, @Body() user: { id: number }, @Res() res: Response): Promise<void> {
        const dontLike = await this.postsService.dontLikePost(+param.id, user.id)
        if (dontLike) res.status(HttpStatus.OK).send({ like: false })
        else
            res.status(HttpStatus.CONFLICT).send({
                error: `post with id ${param.id} not found`,
            })
    }

    @Post(':id/comments/add')
    async addComment(@Param() param: { id: ID }, @Body() comment: CommentDto, @Res() res: Response): Promise<void> {
        const comments = await this.postsService.addComment(+param.id, comment)

        if (comments) res.status(HttpStatus.CREATED).send({ comments })
        else
            res.status(HttpStatus.CONFLICT).send({
                error: `Post with id ${param.id} not found`,
            })
    }

    @Post(':id/comments/edit')
    async editComment(@Param() param: { id: ID }, @Body() editableComment: EditableDto, @Res() res: Response): Promise<void> {
        const comments = await this.postsService.editComment(+param.id, editableComment)

        if (comments) res.status(HttpStatus.OK).send({ comments })
        else
            res.status(HttpStatus.CONFLICT).send({
                error: `Post with id ${param.id} not found`,
            })
    }

    @Delete(':postId/comments/remove/:commentId')
    async removeComment(@Param() param: { postId: ID; commentId: ID }, @Res() res: Response): Promise<void> {
        const removed = await this.postsService.removeComment(+param.postId, +param.commentId)

        if (removed) res.status(HttpStatus.OK).send({ removed })
        else res.status(HttpStatus.OK).send({ removed: false })
    }

    @Post(':postId/comments/like/:commentId')
    async likeComment(@Param() param: { postId: ID; commentId: ID }, @Body() user: { id: number }, @Res() res: Response): Promise<void> {
        const like = await this.postsService.likeComment(+param.postId, +param.commentId, user.id)
        if (like) res.status(HttpStatus.OK).send({ like: true })
        else
            res.status(HttpStatus.CONFLICT).send({
                error: `Post with id ${param.postId} or comment with id ${param.commentId} not found`,
            })
    }

    @Post(':postId/comments/dont-like/:commentId')
    async dontLikeComment(
        @Param() param: { postId: ID; commentId: ID },
        @Body() user: { id: number },
        @Res() res: Response,
    ): Promise<void> {
        const dontLike = await this.postsService.dontLikeComment(+param.postId, +param.commentId, user.id)
        if (dontLike) res.status(HttpStatus.OK).send({ like: false })
        else
            res.status(HttpStatus.CONFLICT).send({
                error: `Post with id ${param.postId} or comment with id ${param.commentId} not found`,
            })
    }
}
