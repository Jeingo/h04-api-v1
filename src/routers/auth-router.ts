import {Router, Response} from "express";
import {loginOrEmailValidation, passwordValidation} from "../middleware/input-auth-validation";
import {inputValidation} from "../middleware/input-validation";
import {RequestWithBody} from "../models/types";
import {BlogsTypeInput} from "../models/auth-models";
import {usersService} from "../domain/users-service";
import {HTTP_STATUSES} from "../constats/status";

export const authRouter = Router({})

authRouter.post('/login'),
    loginOrEmailValidation,
    passwordValidation,
    inputValidation,
    async(req: RequestWithBody<BlogsTypeInput>,
          res: Response) => {
    const checkResult = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if(checkResult) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    }
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
}
