import request from 'supertest'
import {app} from '../../src/app'
import {HTTP_STATUSES} from '../../src/constats/status'
import {PostsTypeInput, PostsTypeOutput} from "../../src/models/posts-models"
import {BlogsTypeInput} from "../../src/models/blogs-models"
import {PaginatedType} from "../../src/models/main-models";

const correctBlog: BlogsTypeInput = {
    name: 'Name',
    description: 'Description',
    websiteUrl: 'https://testurl.com'
}


const correctPost: PostsTypeInput = {
    title: 'Title',
    shortDescription: 'Short Description',
    content: 'Content',
    blogId: '1'
}

const correctNewPost: PostsTypeInput = {
    title: 'TitleNew',
    shortDescription: 'Short Description New',
    content: 'ContentNew',
    blogId: '1'
}

const incorrectPost: PostsTypeInput = {
    title: '',
    shortDescription: '',
    content: '',
    blogId: ''
}

const emptyPosts: PaginatedType<PostsTypeOutput> =
    {
        "pagesCount": 0,
        "page": 1,
        "pageSize": 10,
        "totalCount": 0,
        "items": []
    }

const errorsMessage = {
    "errorsMessages": [
        {
            "message": "Shouldn't be empty",
            "field": "title"
        },
        {
            "message": "Shouldn't be empty",
            "field": "shortDescription"
        },
        {
            "message": "Shouldn't be empty",
            "field": "content"
        },
        {
            "message": "Shouldn't be empty",
            "field": "blogId"
        }
    ]
}

let createdBlog : any = null
describe('/posts', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
        const createdResponse = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send(correctBlog)
            .expect(HTTP_STATUSES.CREATED_201)
        createdBlog = createdResponse.body
        correctPost.blogId = createdBlog.id
        correctNewPost.blogId = createdBlog.id
    })

    it('GET /posts: should return 200 and empty array', async () => {
        await request(app)
            .get('/posts')
            .expect(HTTP_STATUSES.OK_200, emptyPosts)
    })
    it('GET /posts/bad-id: should return 404 for not existing posts', async () => {
        await request(app)
            .get('/posts/999')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`POST /posts: shouldn't create posts without authorization`, async () => {
        await request(app)
            .post('/posts')
            .send(correctPost)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
        await request(app)
            .get('/posts')
            .expect(HTTP_STATUSES.OK_200, emptyPosts)
    })
    it(`POST /posts: shouldn't create posts with incorrect data`, async () => {
        const errMes = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty')
            .send(incorrectPost)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
        await request(app)
            .get('/posts')
            .expect(HTTP_STATUSES.OK_200, emptyPosts)
        expect(errMes.body).toEqual(errorsMessage)
    })
    let createdPost : any = null
    it(`POST /posts: should create posts with correct data`, async () => {
        const createdResponse = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty')
            .send(correctPost)
            .expect(HTTP_STATUSES.CREATED_201)
        createdPost = createdResponse.body
        expect(createdPost).toEqual({
            id: expect.any(String),
            ...correctPost,
            blogName: createdBlog.name,
            createdAt: expect.any(String)
        })
    })
    it(`GET /posts/id: should return post by id`, async () => {
        const response = await request(app)
            .get('/posts' + '/' + createdPost.id)
            .expect(HTTP_STATUSES.OK_200)
        expect(response.body).toEqual({
            id: expect.any(String),
            ...createdPost,
            blogName: createdBlog.name,
            createdAt: expect.any(String)
        })
    })
    it(`PUT /posts/id: shouldn't update post without authorization`, async () => {
        await request(app)
            .put('/posts' + '/' + createdPost.id)
            .send(correctNewPost)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })
    it(`PUT /posts/id: shouldn't update post with incorrect data`, async () => {
        const errMes = await request(app)
            .put('/posts' + '/' + createdPost.id)
            .auth('admin', 'qwerty')
            .send(incorrectPost)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
        expect(errMes.body).toEqual(errorsMessage)
    })
    it(`PUT /posts/id: should update post with correct data`, async () => {
        await request(app)
            .put('/posts' + '/' + createdPost.id)
            .auth('admin', 'qwerty')
            .send(correctNewPost)
            .expect(HTTP_STATUSES.NO_CONTENT_204)
        const response = await request(app)
            .get('/posts' + '/' + createdPost.id)
            .expect(HTTP_STATUSES.OK_200)
        expect(response.body).toEqual({
            id: expect.any(String),
            ...correctNewPost,
            blogName: createdBlog.name,
            createdAt: expect.any(String)
        })
    })
    it('PUT /posts/bad-id: should return 404 for not existing post', async () => {
        await request(app)
            .put('/posts/999')
            .auth('admin', 'qwerty')
            .send(correctNewPost)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`DELETE /posts/id: shouldn't delete post without authorization`, async () => {
        await request(app)
            .delete('/posts' + '/' + createdPost.id)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })
    it(`DELETE /posts/bad-id: should return 404 for not existing post`, async () => {
        await request(app)
            .delete('/posts/999')
            .auth('admin', 'qwerty')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`DELETE /posts/id: should delete post`, async () => {
        await request(app)
            .delete('/posts' + '/' + createdPost.id)
            .auth('admin', 'qwerty')
            .expect(HTTP_STATUSES.NO_CONTENT_204)
        await request(app)
            .get('/posts')
            .expect(HTTP_STATUSES.OK_200, emptyPosts)
    })
})