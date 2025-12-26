import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { likeABlog, deleteABlog } from '../reducers/blogReducer'

const Blog = ({ blog, user }) => {
  const [showDetails, setShowDetails] = useState(false)

  const dispatch = useDispatch()

  const addLike = async () => {
    try {
      dispatch(likeABlog({ ...blog, likes: blog.likes + 1 }))
    } catch {
      console.log('error')
    }
  }
  
  const deleteBlog = async () => {
    try {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
        dispatch(deleteABlog(blog))
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
          {blog.likes}
          <button onClick={addLike}>like</button>
        </div>
        <div>{blog.user.name}</div>
        {blog.user.name === user.name && <button onClick={() => deleteBlog()}>remove</button>}
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setShowDetails(true)}>
        view
      </button>
    </div>
  )
}

export default Blog