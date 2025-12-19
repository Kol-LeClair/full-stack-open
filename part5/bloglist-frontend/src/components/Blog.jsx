import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, user, setBlogs, blogs }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const addLike = async (event) => {
    try {
      const changedBlog = { ...blog, likes: likes + 1 }
      setLikes(likes + 1)
      await blogService.update(blog.id, changedBlog)
    } catch {
      console.log('error')
    }
  }

  const deleteBlog = async (event) => {
    try {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id != blog.id))
      }
    } catch {
      console.log('error')
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  if (showDetails) {
    return (
      <div style={blogStyle}>
        <div>
          {blog.title}
          {blog.author}
          <button onClick={() => setShowDetails(false)}>hide</button>
        </div>
        <div>{blog.url}</div>
        <div>
          likes
          {likes}
          <button onClick={() => addLike()}>like</button>
        </div>
        <div>{blog.user.name}</div>
        {blog.user.name === user.name && <button onClick={() => deleteBlog()}>remove</button>}
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setShowDetails(true)}>view</button>
    </div>
  )
}

export default Blog