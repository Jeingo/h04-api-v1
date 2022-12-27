import {UsersTypeToDB} from "../models/users-models";
import {usersCollection} from "./db";
import {ObjectId} from "mongodb";

export const usersRepository = {
    async createUser(createdUser: UsersTypeToDB) {
        const res = await usersCollection.insertOne(createdUser)
        return {
            id: res.insertedId.toString(),
            login: createdUser.login,
            email: createdUser.email,
            createdAt: createdUser.createdAt
        }
    },
    async deleteUser(id: string) {
        const result = await usersCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },
    async findByLoginOrEmail(loginOrEmail: string) {
        return await usersCollection.findOne(
            {$or: [{email: loginOrEmail}, {login: loginOrEmail}]}
        )
    }
}