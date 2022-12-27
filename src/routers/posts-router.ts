import {Router, Response} from 'express'
import {HTTP_STATUSES} from "../constats/status"
import {postsService} from "../domain/posts-service"
import {idValidation, inputValidation, queryValidation} from "../middleware/input-validation"
import {
    blogIdValidation,
    contentValidation,
    shortDescriptionValidation,
    titleValidation
} from "../middleware/input-posts-validation"
import {auth} from "../authorization/basic-auth"
import {PostsIdParams, PostsTypeInput, PostsTypeOutput} from "../models/posts-models"
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../models/types"
import {postsQueryRepository} from "../query-reositories/posts-query-repository";
import {QueryPosts} from "../models/query-models";
import {PaginatedType} from "../models/main-models";

export const postsRouter = Router({})

postsRouter.get('/', async (req: RequestWithQuery<QueryPosts>,
                                         res: Response<PaginatedType<PostsTypeOutput>>) => {
    const allPosts = await postsQueryRepository.getAllPost(req.query)
    res.status(HTTP_STATUSES.OK_200).json(allPosts)
})

postsRouter.get('/:id',
    idValidation,
    queryValidation,
    async (req: RequestWithParams<PostsIdParams>,
                                            res: Response<PostsTypeOutput>) => {
    const foundPost = await postsService.getPostById(req.params.id)

    if(!foundPost) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    res.json(foundPost)
})

postsRouter.use(auth)

postsRouter.post('/',
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidation,
    async (req: RequestWithBody<PostsTypeInput>,
           res: Response<PostsTypeOutput| null>) => {
    const createdPost = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
    res.status(HTTP_STATUSES.CREATED_201).json(createdPost)
})

postsRouter.put('/:id',
    idValidation,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidation,
    async (req: RequestWithParamsAndBody<PostsIdParams, PostsTypeInput>,
           res: Response) => {
    const updatedPost = await postsService.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)

    if(!updatedPost) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

postsRouter.delete('/:id',
    idValidation,
    async (req: RequestWithParams<PostsIdParams>, res: Response) => {
    const deletedPost = await postsService.deletePost(req.params.id)

    if(!deletedPost) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})