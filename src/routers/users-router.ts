import {Response, Router} from "express"
import {auth} from "../authorization/basic-auth"
import {queryValidation} from "../middleware/input-validation";
import {RequestWithQuery} from "../models/types";
import {PaginatedType} from "../models/main-models";
import {QueryUsers} from "../models/query-models";
import {UsersTypeOutput} from "../models/users-models";
import {HTTP_STATUSES} from "../constats/status";
import {usersQueryRepository} from "../query-reositories/users-query-repository";

export const usersRouter = Router({})

usersRouter.use(auth)

usersRouter.get('/',
    queryValidation,
    async (req: RequestWithQuery<QueryUsers>, res: Response<PaginatedType<UsersTypeOutput>> ) => {
    const allUsers = await usersQueryRepository.getAllUsers(req.query)
    res.status(HTTP_STATUSES.OK_200).json(allUsers)
    })

usersRouter.post('/', async () => {})

usersRouter.delete('/:id', async () => {})