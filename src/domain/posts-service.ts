import {postsRepository} from "../repositories/posts-repository"
import {blogsRepository} from "../repositories/blogs-repository"

export const postsService = {
    async getPostById(id: string) {
        return await postsRepository.getPostById(id)
    },
    async getPostsById(id: string) {
        return await postsRepository.getPostsById(id)
    },
    async createPost(title: string, desc: string, content: string, blogId: string) {
        const foundBlog = await blogsRepository.getBlogById(blogId)
        if(foundBlog) {
            const createdPost = {
                title: title,
                shortDescription: desc,
                content: content,
                blogId: blogId,
                blogName: foundBlog.name,
                createdAt: new Date().toISOString()
            }
            return await postsRepository.createPost(createdPost)
        }
        return null
    },
    async updatePost(id: string, title: string, desc: string, content: string, blogId: string) {
        const foundBlog = await blogsRepository.getBlogById(blogId)
        if(foundBlog) {
            return await postsRepository.updatePost(id, title, desc, content, blogId, foundBlog.name)
        }
        return null
    },
    async deletePost(id: string) {
        return await postsRepository.deletePost(id)
    }
}