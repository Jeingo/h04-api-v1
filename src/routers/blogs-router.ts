import {Router, Response} from 'express'
import {HTTP_STATUSES} from "../constats/status"
import {blogsService} from "../domain/blogs-service"
import {inputValidation} from "../middleware/input-validation"
import {
    descriptionValidation,
    nameValidation,
    websiteUrlValidation
} from "../middleware/input-blogs-vallidation"
import {auth} from "../authorization/basic-auth"
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../models/types"
import {BlogsIdParams, BlogsTypeInput, BlogsTypeOutput, BlogsTypeWithQuery} from "../models/blogs-models"
import {contentValidation, shortDescriptionValidation, titleValidation} from "../middleware/input-posts-validation";
import {PostsIdParams, PostsTypeInputInBlog, PostsTypeOutput, PostsTypeWithQuery} from "../models/posts-models";
import {postsService} from "../domain/posts-service";
import {blogsQueryRepository} from "../query-reositories/blogs-query-repository";
import {postsQueryRepository} from "../query-reositories/posts-query-repository";
import {QueryBlogs} from "../models/query-models";


export const blogsRouter = Router({})

blogsRouter.get('/', async (req: RequestWithQuery<QueryBlogs>,
                                         res: Response<BlogsTypeWithQuery>) => {
    const allBlogs = await blogsQueryRepository.getAllBlogs(req.query)
    res.status(HTTP_STATUSES.OK_200).json(allBlogs)
})

blogsRouter.get('/:id', async (req: RequestWithParams<BlogsIdParams>,
                                            res: Response<BlogsTypeOutput>) => {
    const foundBlog = await blogsService.getBlogById(req.params.id)

    if(!foundBlog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    res.json(foundBlog)
})

blogsRouter.get('/:id/posts',
    async (req: RequestWithParamsAndQuery<PostsIdParams, QueryBlogs>,
           res: Response<PostsTypeWithQuery| null>) => {
        const foundPosts = await postsQueryRepository.getPostsById(req.params.id, req.query)

        if(!foundPosts) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.json(foundPosts)
    })

blogsRouter.use(auth)

blogsRouter.post('/',
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidation,
    async (req: RequestWithBody<BlogsTypeInput>,
           res: Response<BlogsTypeOutput>) => {
    const createdBlog = await blogsService.createBlog(req.body.name, req.body.description, req.body.websiteUrl)
    res.status(HTTP_STATUSES.CREATED_201).json(createdBlog)
})

blogsRouter.post('/:id/posts',
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidation,
    async (req: RequestWithParamsAndBody<PostsIdParams,PostsTypeInputInBlog>,
           res: Response<PostsTypeOutput| null>) => {
        const createdPost = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.params.id)

        if(!createdPost) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.status(HTTP_STATUSES.CREATED_201).json(createdPost)
    })

blogsRouter.put('/:id',
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidation,
    async (req: RequestWithParamsAndBody<BlogsIdParams,BlogsTypeInput>,
           res: Response) => {
    const updatedBlog = await blogsService.updateBlog(req.params.id, req.body.name, req.body.description, req.body.websiteUrl)

    if(!updatedBlog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

blogsRouter.delete('/:id', async (req: RequestWithParams<BlogsIdParams>, res: Response) => {
    const deletedBlog = await blogsService.deleteBlog(req.params.id)

    if(!deletedBlog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
