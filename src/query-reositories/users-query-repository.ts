import {QueryUsers} from "../models/query-models";
import {PaginatedType} from "../models/main-models";
import {UsersTypeOutput} from "../models/users-models";
import {getPaginatedType, makeDirectionToNumber} from "./helper";
import {usersCollection} from "../repositories/db";

const getOutputUser = (user: any): UsersTypeOutput => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}

export const usersQueryRepository = {
    async getAllUsers(query: QueryUsers): Promise<PaginatedType<UsersTypeOutput>> {
        const {
            searchLoginTerm = null,
            searchEmailTerm = null,
            sortBy = 'createdAt',
            sortDirection = 'desc',
            pageNumber = 1,
            pageSize = 10
        } = query
        const sortDirectionNumber = makeDirectionToNumber(sortDirection)
        const skipNumber = (+pageNumber - 1) * +pageSize
        let filter = {}
        if (searchLoginTerm) {
            filter = {name: {$regex: new RegExp(searchLoginTerm, "gi")}}
        }
        const countAllDocuments = await usersCollection.countDocuments(filter)
        const res = await usersCollection
            .find(filter)
            .sort({[sortBy]: sortDirectionNumber})
            .skip(skipNumber)
            .limit(+pageSize)
            .toArray()
        return getPaginatedType(res.map(getOutputUser), +pageSize, +pageNumber, countAllDocuments)
    }
}