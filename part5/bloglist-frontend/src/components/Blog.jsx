import { useState } from 'react'

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false)
  
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
          <button onClick={() => console.log('like')}>like</button>
        </div>
        <div>{blog.user.name}</div>
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