import {blogsCollection} from "./db"
import {ObjectId} from "mongodb"
import {BlogsTypeOutput, BlogsTypeToBD} from "../models/blogs-models"

const getOutputBlog = (blog: any): BlogsTypeOutput => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt
    }
}

export const blogsRepository = {
    async getAllBlogs() {
        const tmpRes = await blogsCollection.find({}).toArray()
        return tmpRes.map(getOutputBlog)
    },
    async getBlogById(id: string) {
        if(!ObjectId.isValid(id)) {
            return null
        }
        const res = await blogsCollection.findOne({_id: new ObjectId(id)})

        if(res) {
            return getOutputBlog(res)
        }
        return null
    },
    async createBlog(createdBlog: BlogsTypeToBD) {
        const res = await blogsCollection.insertOne(createdBlog)
        return {
            id: res.insertedId.toString(),
            name: createdBlog.name,
            description: createdBlog.description,
            websiteUrl: createdBlog.websiteUrl,
            createdAt: createdBlog.createdAt
        }
    },
    async updateBlog(id: string, name: string, desc: string, url: string) {
        if(!ObjectId.isValid(id)) {
            return null
        }
        const result = await blogsCollection
            .updateOne({_id: new ObjectId(id)},{$set: {name: name, description: desc, websiteUrl: url}})
        return result.matchedCount === 1
    },
    async deleteBlog(id: string) {
        if(!ObjectId.isValid(id)) {
            return null
        }
        const result = await blogsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}