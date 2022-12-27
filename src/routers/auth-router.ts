import {Router, Response} from "express";
import {
    loginOrEmailValidation,
    passwordFromAuthValidation
} from "../middleware/input-auth-validation";
import {inputValidation} from "../middleware/input-validation";
import {RequestWithBody} from "../models/types";
import {LoginTypeInput} from "../models/auth-models";
import {HTTP_STATUSES} from "../constats/status";
import {authService} from "../domain/auth-service";

export const authRouter = Router({})

authRouter.post('/login',
    loginOrEmailValidation,
    passwordFromAuthValidation,
    inputValidation,
    async(req: RequestWithBody<LoginTypeInput>,
          res: Response) => {
    const checkResult = await authService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if(checkResult) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    }
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
})
