import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addNotification } from "./reducers/notificationReducer";
import { initializeBlogs } from "./reducers/blogReducer";
import { initializeUser, logoutTheUser } from "./reducers/userReducer";
import { 
  BrowserRouter as Router,
  Routes, Route, Link,
  useParams, useNavigate, useMatch
 } from "react-router-dom";

import "./index.css";

import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";
import userService from "./services/users"
import User from "./components/User";

const Menu = ({ user }) => {
  const padding = {
    paddingRight: 5
  }

  const background = {
    backgroundColor: 'LightGray' 
  }

  return (
    <div style={background}>
      <Link to='/' style={padding}>blogs</Link>
      <Link to='/users' style={padding}>users</Link>
      {user.name} logged in
      <button
        onClick={() => {
          window.localStorage.removeItem("loggedBlogappUser");
          dispatch(logoutTheUser())
        }}
      >
      logout
      </button>
    </div>
  )
}

const App = () => {
  const dispatch = useDispatch()
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [users, setUsers] = useState([])

  const blogFormRef = useRef();

  useEffect(() => {
    dispatch(initializeBlogs())
    userService.getAll().then(users => {
      setUsers(users)
    })
  }, [dispatch]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(initializeUser(user))
      blogService.setToken(user.token);
    }
  }, []);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const blogs = useSelector(({ blogs }) => {
    return blogs
  })

  const user = useSelector(({ user }) => user)

  const userMatch = useMatch('/users/:id')
  const blogMatch = useMatch('/blogs/:id')
  
  const selectedUser = userMatch
    ? users.find(u => u.id === String(userMatch.params.id))
    : null
  
  const selectedBlog = blogMatch
    ? blogs.find(b => b.id === String(blogMatch.params.id))
    : null

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));

      blogService.setToken(user.token);
      dispatch(initializeUser(user))
      setUsername("");
      setPassword("");
    } catch {
      setIsError(true);
      dispatch(addNotification('wrong username or password', 5))
      setTimeout(() => {
        setIsError(false);
      }, 5000);
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  );

  return (
    <div>

      {!user && (
        <div>
          <h2>log in to application</h2>
          <Notification isError={isError} />
          {loginForm()}
        </div>
      )}

      {user && (
        <div>
          <Menu user={user} />

          <h2>blogs</h2>

          <Notification isError={isError} />

          <Routes>
            <Route path="/blogs/:id" element={
              <Blog
                blog={selectedBlog}
                user={user}
              />
            }
            />
            <Route path="/users" element={
              <div>
                <h2>Users</h2>
                <b>name - blogs created</b>
                {users.map(user => 
                  <div key={user.id}>
                    <Link to={`/users/${user.id}`}>{user.name}</Link> - {user.blogs.length}
                  </div>)}
              </div>
            } />
            <Route path="/users/:id" element={<User user={selectedUser}/>} />
            <Route path="/" element={
              <div>
                <Togglable buttonLabel={"create new blog"} ref={blogFormRef}>
                  <BlogForm
                    blogs={blogs}
                    blogFormRef={blogFormRef}
                  />
                </Togglable>

                {blogs
                  .map((blog) => (
                    <Link key={blog.id} to={`/blogs/${blog.id}`}>
                      <div style={blogStyle} key={blog.id}>{blog.title} {blog.author}</div>
                    </Link>
                  ))}
              </div>
            } />
          </Routes>
        </div>
      )}

    </div>
  );
};

export default App;
