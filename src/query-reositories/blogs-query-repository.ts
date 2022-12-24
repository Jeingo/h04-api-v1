import {BlogsTypeOutput} from "../models/blogs-models"
import {blogsCollection} from "../repositories/db"

const getOutputBlog = (blog: any): BlogsTypeOutput => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt
    }
}

export const blogsQueryRepository = {
    async getAllBlogs() {
        const res = await blogsCollection.find({}).toArray()
        return res.map(getOutputBlog)
    }
}