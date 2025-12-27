import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { likeABlog, deleteABlog } from '../reducers/blogReducer'
import { useNavigate } from 'react-router-dom'

const Blog = ({ blog, user }) => {
  // const [showDetails, setShowDetails] = useState(false)
  console.log(blog)

  const navigate = useNavigate()

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
        navigate('/')
      }
    } catch {
      console.log('error')
    }
  }

  /*
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  */
  if (blog === undefined) {
      return null
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>{blog.url}</p>
      <p>{blog.author}</p>
      <p>
        likes
        {blog.likes}
        <button onClick={addLike}>like</button>
      </p>
      <p>added by {blog.user.name}</p>
      {blog.user.name === user.name && <button onClick={() => deleteBlog()}>remove</button>}
    </div>
  )
}

export default Blog