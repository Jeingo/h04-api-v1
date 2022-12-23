import {testRepository} from "../repositories/test-repository"

export const testService = {
    async deleteAllDB() {
        await testRepository.deleteAllDB()
    }
}