import {BlogsTypeOutput, BlogsTypeWithQuery} from "../models/blogs-models"
import {blogsCollection} from "../repositories/db"
import {QueryBlogs} from "../models/query-models"

const getOutputBlog = (blog: any): BlogsTypeOutput => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt
    }
}

const getOutputBlogWithQuery = (blogs: BlogsTypeOutput[],
                                pS: number,
                                pN: number,
                                countDoc: number) : BlogsTypeWithQuery => {
    const res = {
        pagesCount: Math.ceil(countDoc/pS),
        page: pN,
        pageSize: pS,
        totalCount: countDoc,
        items: blogs
    }
    return res
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
    async getAllBlogs(query: QueryBlogs) {
        const countAllDocuments = await blogsCollection.countDocuments()
        const {searchNameTerm = null, sortBy = 'createdAt', sortDirection = 'desc', pageNumber = 1, pageSize = 10} = query
        const sortDirectionNumber = makeDirectionToNumber(sortDirection)
        const skipNumber = (+pageNumber - 1) * +pageSize
        let res = null
        if(searchNameTerm) {
            const countAllDocumentsWithFilter = await blogsCollection.countDocuments({name: {$regex: new RegExp(searchNameTerm, "gi")}})
            res = await blogsCollection
                .find({name: {$regex: new RegExp(searchNameTerm, "gi")}})
                .sort({[sortBy]: sortDirectionNumber})
                .skip(skipNumber)
                .limit(+pageSize)
                .toArray()
            return getOutputBlogWithQuery(res.map(getOutputBlog), +pageSize, +pageNumber, countAllDocumentsWithFilter)
        } else {
            res = await blogsCollection
                .find({})
                .sort({[sortBy]: sortDirectionNumber})
                .skip(skipNumber)
                .limit(+pageSize)
                .toArray()
            return getOutputBlogWithQuery(res.map(getOutputBlog), +pageSize, +pageNumber, countAllDocuments)
        }
    }
}