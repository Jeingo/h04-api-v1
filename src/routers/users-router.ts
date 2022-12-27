import {Response, Router} from "express"
import {auth} from "../authorization/basic-auth"
import {inputValidation, queryValidation} from "../middleware/input-validation";
import {RequestWithBody, RequestWithQuery} from "../models/types";
import {PaginatedType} from "../models/main-models";
import {QueryUsers} from "../models/query-models";
import {UsersTypeInput, UsersTypeOutput} from "../models/users-models";
import {HTTP_STATUSES} from "../constats/status";
import {usersQueryRepository} from "../query-reositories/users-query-repository";
import {emailValidation, loginValidation, passwordValidation} from "../middleware/input-users-validation";

export const usersRouter = Router({})

usersRouter.use(auth)

usersRouter.get('/',
    queryValidation,
    async (req: RequestWithQuery<QueryUsers>, res: Response<PaginatedType<UsersTypeOutput>> ) => {
    const allUsers = await usersQueryRepository.getAllUsers(req.query)
    res.status(HTTP_STATUSES.OK_200).json(allUsers)
    })

usersRouter.post('/',
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidation,
    async (req: RequestWithBody<UsersTypeInput>,
           res: Response<UsersTypeOutput>) => {
        // const createdUser = await
    })

usersRouter.delete('/:id', async () => {})