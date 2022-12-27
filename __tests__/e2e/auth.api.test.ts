import request from "supertest"
import {app} from "../../src/app"
import {HTTP_STATUSES} from '../../src/constats/status'

const correctUser = {
    login: 'login',
    password: 'password',
    email: 'email@gmail.com'
}

const correctLogin = {
    loginOrEmail: 'login',
    password: 'password'
}

const correctBadLogin = {
    loginOrEmail: 'login',
    password: 'passwor'
}

const incorrectLogin = {
    login: '',
    password: ''
}

const errorsMessage = {
    "errorsMessages": [
        {
            "message": "Shouldn't be empty",
            "field": "loginOrEmail"
        },
        {
            "message": "Shouldn't be empty",
            "field": "password"
        }
    ]
}
let createdUser: any = null
describe('/auth/login', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
        const createdResponse = await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send(correctUser)
            .expect(HTTP_STATUSES.CREATED_201)
        createdUser = createdResponse.body
    })
    it('POST /auth/login: should return 400 with incorrect data', async () => {
        const errMes = await request(app)
            .post('/auth/login')
            .send(incorrectLogin)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
        expect(errMes.body).toEqual(errorsMessage)
    })
    it('POST /auth/login: should return 401 if the password or login is wrong', async () => {
        await request(app)
            .post('/auth/login')
            .send(correctBadLogin)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })
    it('POST /auth/login: should return 204 if the password or login is correct', async () => {
        await request(app)
            .post('/auth/login')
            .send(correctLogin)
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    })
})