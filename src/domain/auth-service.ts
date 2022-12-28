import bcrypt from "bcrypt";
import {authRepository} from "../repositories/auth-repository";

export const authService = {
    async checkCredentials(loginOrEmail: string, password: string): Promise<boolean> {
        const user = await authRepository.findByLoginOrEmail(loginOrEmail)
        if(!user) return false
        return await bcrypt.compare(password,user.hash)
    }
}