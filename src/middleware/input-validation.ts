import {validationResult} from "express-validator"
import {NextFunction, Request, Response} from "express"

const baseValidationResult = validationResult.withDefaults({
    formatter: error => {
        return {
            message: error.msg,
            field: error.param
        }
    }
})

export const inputValidation = (req: Request, res: Response, next: NextFunction) => {
    const errors = baseValidationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ errorsMessages: errors.array({onlyFirstError: true}) })
    } else {
        next()
    }
}