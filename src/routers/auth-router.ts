import {Router} from "express";
import {loginOrEmailValidation, passwordValidation} from "../middleware/input-auth-validation";
import {inputValidation} from "../middleware/input-validation";

export const authRouter = Router({})

authRouter.post('/'),
    loginOrEmailValidation,
    passwordValidation,
    inputValidation,
    async() => {

    }
