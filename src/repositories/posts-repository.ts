import {blogsCollection, postsCollection} from "./db"
import {ObjectId} from "mongodb"
import {PostsTypeOutput} from "../models/posts-models";

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

export const postsRepository = {
    async getAllPost() {
        const tmpRes = await postsCollection.find({}).toArray()
        return tmpRes.map(getOutputPost)
    },
    async getPostById(id: string) {
        if(!ObjectId.isValid(id)) {
            return null
        }
        const res = await postsCollection.findOne({_id: new ObjectId(id)})
        if(res) {
            return getOutputPost(res)
        }
            return null
    },
    async createPost(title: string, desc: string, content: string, blogId: string) {
        const foundBlog = await blogsCollection.findOne({_id: new ObjectId(blogId)})
        if(foundBlog) {
            const createdPost = {
                title: title,
                shortDescription: desc,
                content: content,
                blogId: blogId,
                blogName: foundBlog.name,
                createdAt: new Date().toISOString()
            }
            const res = await postsCollection.insertOne(createdPost)
            return {
                id: res.insertedId.toString(),
                title: title,
                shortDescription: desc,
                content: content,
                blogId: blogId,
                blogName: foundBlog.name,
                createdAt: createdPost.createdAt
            }
        }
        return null
    },
    async updatePost(id: string, title: string, desc: string, content: string, blogId: string) {
        if(!ObjectId.isValid(id) || !ObjectId.isValid(blogId)) {
            console.log('here')
            return null
        }
        const foundBlog = await blogsCollection.findOne({_id: new ObjectId(blogId)})
        if(foundBlog) {
            const updatePost = await postsCollection
                .updateOne({_id: new ObjectId(id)},
                    {$set: {title: title, shortDescription: desc, content: content, blogId: blogId, blogName: foundBlog.name}})
            return updatePost.matchedCount === 1
        }
        return null
    },
    async deletePost(id: string) {
        if(!ObjectId.isValid(id)) {
            return null
        }
        const result = await postsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}