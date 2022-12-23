import {blogsRepository} from "../repositories/blogs-repository"

export const blogsService = {
    async getAllBlogs() {
        return await blogsRepository.getAllBlogs()
    },
    async getBlogById(id: string) {
        return await blogsRepository.getBlogById(id)
    },
    async createBlog(name: string, desc: string, url: string) {
        const createdBlog = {
            name: name,
            description: desc,
            websiteUrl: url,
            createdAt: new Date().toISOString()
        }
        return await blogsRepository.createBlog(createdBlog)
    },
    async updateBlog(id: string, name: string, desc: string, url: string) {
        return await blogsRepository.updateBlog(id, name, desc, url)
    },
    async deleteBlog(id: string) {
        return await blogsRepository.deleteBlog(id)
    }
}