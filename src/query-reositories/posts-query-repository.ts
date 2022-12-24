import {PostsTypeOutput} from "../models/posts-models"
import {postsCollection} from "../repositories/db"
import {ObjectId} from "mongodb"

const getOutputPost = (post: any): PostsTypeOutput => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}

export const postsQueryRepository = {
    async getAllPost() {
        const res = await postsCollection.find({}).toArray()
        return res.map(getOutputPost)
    },
    async getPostsById(id: string) {
        if(!ObjectId.isValid(id)) {
            return null
        }
        const res = await postsCollection.find({blogId: id}).toArray()
        if(res) {
            return res.map(getOutputPost)
        }
        return null
    }
}