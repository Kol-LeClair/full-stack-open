import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addNotification } from "./reducers/notificationReducer";
import { initializeBlogs } from "./reducers/blogReducer";
import { initializeUser, logoutTheUser } from "./reducers/userReducer";

import "./index.css";

import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const dispatch = useDispatch()
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);

  const blogFormRef = useRef();

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(initializeUser(user))
      blogService.setToken(user.token);
    }
  }, []);

  const blogs = useSelector(({ blogs }) => {
    return blogs
  })

  const user = useSelector(({ user }) => user)

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
          <h2>blogs</h2>

          <Notification isError={isError} />

          <p>
            {user.name} logged in
            <button
              onClick={() => {
                window.localStorage.removeItem("loggedBlogappUser");
                dispatch(logoutTheUser())
              }}
            >
              logout
            </button>
          </p>

          <Togglable buttonLabel={"create new blog"} ref={blogFormRef}>
            <BlogForm
              blogs={blogs}
              blogFormRef={blogFormRef}
            />
          </Togglable>

          {blogs
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                user={user}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default App;
