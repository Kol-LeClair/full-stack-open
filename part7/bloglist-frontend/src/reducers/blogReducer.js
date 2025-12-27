import { createSlice } from "@reduxjs/toolkit"
import blogService from "../services/blogs"
import userService from '../services/users'

const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        createBlog(state, action) {
            state.push(action.payload)
        },
        updateBlog(state, action) {
            const changedBlog = action.payload

            return state
                .map(blog => (blog.id !== changedBlog.id ? blog : changedBlog))
                .sort((a, b) => b.likes - a.likes)
        },
        deleteBlog(state, action) {
            const deletedBlog = action.payload
        
            return state
                .filter(blog => blog.id !== deletedBlog.id)
        },  
        setBlogs(state, action) {
            return action.payload
        }
    }
})

const { setBlogs, createBlog, updateBlog, deleteBlog } = blogSlice.actions

export const initializeBlogs = () => {
    return async (dispatch) => {
        const blogs = await blogService.getAll()
        blogs.sort((a, b) => b.likes - a.likes)
        dispatch(setBlogs(blogs))
    }
}

export const likeABlog = (blog) => {
    return async (dispatch) => {
        const changedBlog = await blogService.update(blog.id, blog)
        const user = await userService.getUser(changedBlog.user)
        dispatch(updateBlog({...changedBlog, user: user}))
    }
}

export const commentBlog = (blog) => {
    return async (dispatch) => {
        const changedBlog = await blogService.update(blog.id, blog)
        const user = await userService.getUser(changedBlog.user)
        dispatch(updateBlog({...changedBlog, user: user}))
    }
}

export const deleteABlog = (blog) => {
    return async (dispatch) => {
        await blogService.remove(blog.id)
        dispatch(deleteBlog(blog))
    }
}

export const appendBlog = (blog) => {
    return async (dispatch) => {
        const newBlog = await blogService.create(blog)
        dispatch(createBlog(newBlog))
    }
}

export default blogSlice.reducer