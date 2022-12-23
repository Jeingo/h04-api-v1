import request from 'supertest'
import {app} from '../../src/app'
import {HTTP_STATUSES} from '../../src/constats/status'
import {BlogsTypeInput} from "../../src/models/blogs-models"


const correctBlog: BlogsTypeInput = {
    name: 'Name',
    description: 'Description',
    websiteUrl: 'https://testurl.com'
}

const correctNewBlog: BlogsTypeInput = {
    name: 'NameNew',
    description: 'DescriptionNew',
    websiteUrl: 'https://testurlnew.com'
}

const incorrectBlog: BlogsTypeInput = {
    name: '',
    description: '',
    websiteUrl: ''
}

const errorsMessage = {
    "errorsMessages": [
        {
            "message": "Shouldn't be empty",
            "field": "name"
        },
        {
            "message": "Shouldn't be empty",
            "field": "description"
        },
        {
            "message": "Shouldn't be empty",
            "field": "websiteUrl"
        }
    ]
}

describe('/blogs', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })
    it('GET /blogs: should return 200 and empty array', async () => {
        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK_200, [])
    })
    it('GET /blogs/bad-id: should return 404 for not existing blog', async () => {
        await request(app)
            .get('/blogs/999')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
     it(`POST /blogs: shouldn't create blog without authorization`, async () => {
         await request(app)
            .post('/blogs')
            .send(correctBlog)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
         await request(app)
             .get('/blogs')
             .expect(HTTP_STATUSES.OK_200, [])
     })
    it(`POST /blogs: shouldn't create blog with incorrect data`, async () => {
        const errMes = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send(incorrectBlog)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK_200, [])
        expect(errMes.body).toEqual(errorsMessage)
    })
    let createdBlog : any = null
    it(`POST /blogs: should create blog with correct data`, async () => {
        const createdResponse = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send(correctBlog)
            .expect(HTTP_STATUSES.CREATED_201)
        createdBlog = createdResponse.body
        expect(createdBlog).toEqual({
            id: expect.any(String),
            ...correctBlog,
            createdAt: expect.any(String)
        })
    })
    it(`GET /blogs/id: should return blog by id`, async () => {
        const response = await request(app)
            .get('/blogs' + '/' + createdBlog.id)
            .expect(HTTP_STATUSES.OK_200)
        expect(response.body).toEqual({
            id: expect.any(String),
            ...correctBlog,
            createdAt: expect.any(String)
        })
    })
    it(`PUT /blogs/id: shouldn't update blog without authorization`, async () => {
        await request(app)
            .put('/blogs' + '/' + createdBlog.id)
            .send(correctNewBlog)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })
    it(`PUT /blogs/id: shouldn't update blog with incorrect data`, async () => {
        const errMes = await request(app)
            .put('/blogs' + '/' + createdBlog.id)
            .auth('admin', 'qwerty')
            .send(incorrectBlog)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
        expect(errMes.body).toEqual(errorsMessage)
    })
    it(`PUT /blogs/id: should update blog with correct data`, async () => {
        await request(app)
            .put('/blogs' + '/' + createdBlog.id)
            .auth('admin', 'qwerty')
            .send(correctNewBlog)
            .expect(HTTP_STATUSES.NO_CONTENT_204)
        const response = await request(app)
            .get('/blogs' + '/' + createdBlog.id)
            .expect(HTTP_STATUSES.OK_200)
        expect(response.body).toEqual({
            id: expect.any(String),
            ...correctNewBlog,
            createdAt: expect.any(String)
        })
    })
    it('PUT /blogs/bad-id: should return 404 for not existing blog', async () => {
        await request(app)
            .put('/blogs/999')
            .auth('admin', 'qwerty')
            .send(correctNewBlog)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`DELETE /blogs/id: shouldn't delete blog without authorization`, async () => {
        await request(app)
            .delete('/blogs' + '/' + createdBlog.id)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })
    it(`DELETE /blogs/bad-id: should return 404 for not existing blog`, async () => {
        await request(app)
            .delete('/blogs/999')
            .auth('admin', 'qwerty')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`DELETE /blogs/id: should delete blog`, async () => {
        await request(app)
            .delete('/blogs' + '/' + createdBlog.id)
            .auth('admin', 'qwerty')
            .expect(HTTP_STATUSES.NO_CONTENT_204)
        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK_200, [])
    })
})