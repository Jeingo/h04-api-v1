import {usersRepository} from "../repositories/users-repository";
import {UsersTypeOutput} from "../models/users-models";
import bcrypt from "bcrypt"

export const usersService = {
    async createUser(login: string, password: string, email: string): Promise<UsersTypeOutput> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, passwordSalt)
        const createdUser = {
            login: login,
            hash: passwordHash,
            email: email,
            createdAt: new Date().toISOString()
        }
        return await usersRepository.createUser(createdUser)
    },
    async deleteUser(id: string) {
        return await usersRepository.deleteUser(id)
    },
    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if(!user) return false
        return await bcrypt.compare(password,user.hash)
    }
}