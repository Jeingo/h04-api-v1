import express from 'express'
import {blogsRouter} from "./routers/blogs-router"
import {postsRouter} from "./routers/posts-router"
import {testRouter} from "./routers/test-router"

export const app = express()

export const PORT = process.env.PORT || 5000

app.use(express.json())

app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/testing/all-data', testRouter)
