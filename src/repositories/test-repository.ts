import {blogsCollection, postsCollection} from "./db"

export const testRepository = {
    async deleteAllDB() {
        await blogsCollection.deleteMany({})
        await postsCollection.deleteMany({})
    }
}