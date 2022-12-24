import {PostsTypeOutput} from "../models/posts-models"
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
        const {sortBy = 'createdAt', sortDirection = 'desc', pageNumber = 1, pageSize = 10} = query
        const sortDirectionNumber = makeDirectionToNumber(sortDirection)
        const skipNumber = (+pageNumber - 1) * +pageSize
        const res = await postsCollection
            .find()
            .sort({[sortBy]: sortDirectionNumber})
            .skip(skipNumber)
            .limit(+pageSize)
            .toArray()
        return res.map(getOutputPost)
    },
    async getPostsById(id: string, query: QueryPosts) {
        if(!ObjectId.isValid(id)) {
            return null
        }
        const {sortBy = 'createdAt', sortDirection = 'desc', pageNumber = 1, pageSize = 10} = query
        const sortDirectionNumber = makeDirectionToNumber(sortDirection)
        const skipNumber = (+pageNumber - 1) * +pageSize
        const res = await postsCollection
            .find({blogId: id})
            .sort({[sortBy]: sortDirectionNumber})
            .skip(skipNumber)
            .limit(+pageSize)
            .toArray()
        if(res) {
            return res.map(getOutputPost)
        }
        return null
    }
}