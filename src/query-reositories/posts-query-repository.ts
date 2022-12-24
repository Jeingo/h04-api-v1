import {PostsTypeOutput, PostsTypeWithQuery} from "../models/posts-models"
import {postsCollection} from "../repositories/db"
import {ObjectId} from "mongodb"
import {QueryPosts} from "../models/query-models";

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

const getOutputPostWithQuery = (posts: PostsTypeOutput[],
                                pS: number,
                                pN: number,
                                countDoc: number) : PostsTypeWithQuery => {
    return {
        pagesCount: Math.ceil(countDoc/pS),
        page: pN,
        pageSize: pS,
        totalCount: countDoc,
        items: posts
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

export const postsQueryRepository = {
    async getAllPost(query: QueryPosts) {
        const countAllDocuments = await postsCollection.countDocuments()
        const {sortBy = 'createdAt', sortDirection = 'desc', pageNumber = 1, pageSize = 10} = query
        const sortDirectionNumber = makeDirectionToNumber(sortDirection)
        const skipNumber = (+pageNumber - 1) * +pageSize
        const res = await postsCollection
            .find()
            .sort({[sortBy]: sortDirectionNumber})
            .skip(skipNumber)
            .limit(+pageSize)
            .toArray()
        return getOutputPostWithQuery(res.map(getOutputPost), +pageSize, +pageNumber, countAllDocuments)
    },
    async getPostsById(id: string, query: QueryPosts) {
        if(!ObjectId.isValid(id)) {
            return null
        }
        const countAllDocuments = await postsCollection.countDocuments({blogId: id})
        const {sortBy = 'createdAt', sortDirection = 'desc', pageNumber = 1, pageSize = 10} = query
        const sortDirectionNumber = makeDirectionToNumber(sortDirection)
        const skipNumber = (+pageNumber - 1) * +pageSize
        const res = await postsCollection
            .find({blogId: id})
            .sort({[sortBy]: sortDirectionNumber})
            .skip(skipNumber)
            .limit(+pageSize)
            .toArray()
        console.log(res)
        if(res.length !== 0) {
            return getOutputPostWithQuery(res.map(getOutputPost), +pageSize, +pageNumber, countAllDocuments)
        }
        return null
    }
}