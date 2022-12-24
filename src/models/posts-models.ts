export type PostsTypeOutput = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type PostsTypeInput = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}

export type PostsTypeInputInBlog = {
    title: string
    shortDescription: string
    content: string
}

export type PostsTypeToDB = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type PostsTypeWithQuery = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostsTypeOutput[]
}

export type PostsIdParams = {
    id: string
}