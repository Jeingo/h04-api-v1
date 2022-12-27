import {blogsCollection, postsCollection, usersCollection} from "./db"

export const testRepository = {
    async deleteAllDB() {
        await blogsCollection.deleteMany({})
        await postsCollection.deleteMany({})
        await usersCollection.deleteMany({})
    }
}