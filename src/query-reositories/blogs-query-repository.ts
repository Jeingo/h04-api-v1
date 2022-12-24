import {BlogsTypeOutput} from "../models/blogs-models"
import {blogsCollection} from "../repositories/db"
import {Query} from "../models/query-models"

const getOutputBlog = (blog: any): BlogsTypeOutput => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt
    }
}

const makeDirectionToNumber = (val: string) => {
    switch(val) {
        case 'asc':
            return 1
        case 'desc':
            return -1
        default:
            return -1
    }
}

export const blogsQueryRepository = {
    async getAllBlogs(query: Query) {
        const {searchNameTerm = null, sortBy = 'createdAt', sortDirection = 'desc', pageNumber = 1, pageSize = 10} = query
        const sortDirectionNumber = makeDirectionToNumber(sortDirection)
        const skipNumber = (+pageNumber - 1) * +pageSize
        let res = null
        if(searchNameTerm) {
            res = await blogsCollection
                .find({name: {$regex: new RegExp(searchNameTerm, "gi")}})
                .sort({[sortBy]: sortDirectionNumber})
                .skip(skipNumber)
                .limit(+pageSize)
                .toArray()
            return res.map(getOutputBlog)
        }
        res = await blogsCollection
            .find()
            .sort({[sortBy]: sortDirectionNumber})
            .skip(skipNumber)
            .limit(+pageSize)
            .toArray()
        return res.map(getOutputBlog)
    }
}