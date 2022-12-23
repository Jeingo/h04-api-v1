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

export type PostsIdParams = {
    id: string
}