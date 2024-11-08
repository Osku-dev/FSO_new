import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { setNotificationWithTimeout } from "./reducers/notificationReducer";
import { fetchBlogs, createBlog, likeBlog, deleteBlog } from "./reducers/blogReducer";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const blogs = useSelector((state) => state.blogs);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBlogs());
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const loginForm = () => {
    return (
      <div>
        <Togglable buttonLabel="login">
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      </div>
    );
  };

  const blogFormRef = useRef();

  const blogForm = () => {
    return (
      <div>
        <Togglable buttonLabel="Create New Blog">
          <BlogForm handleCreateBlog={handleCreateBlog} ref={blogFormRef} />
        </Togglable>
      </div>
    );
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      dispatch(setNotificationWithTimeout("Login successful", "success", 5));
    } catch (exception) {
      dispatch(
        setNotificationWithTimeout("Incorrect username or password", "error", 5)
      );
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
    dispatch(
      setNotificationWithTimeout("Logged out successfully", "success", 5)
    );
  };

  const handleCreateBlog = async (event) => {
    event.preventDefault();
    const newBlog = blogFormRef.current.getNewBlog();

    const success = await dispatch(createBlog(newBlog, user.username));
    if (success) {
      dispatch(
        setNotificationWithTimeout(
          "New blog created successfully",
          "success",
          5
        )
      );
      blogFormRef.current.clearInputFields();
    } else {
      dispatch(
        setNotificationWithTimeout("Failed to create new blog", "error", 5)
      );
    }
  };

    const handleLike = async (id) => {
      const success = await dispatch(likeBlog(id));
    
      if (!success) {
        dispatch(
          setNotificationWithTimeout("Error updating likes", "error", 5)
        );
      }
    };

    const handleRemove = async (blog) => {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete the blog "${blog.title}" by ${blog.author}?`
      );
      if (!confirmDelete) {
        return;
      }
    
      const success = await dispatch(deleteBlog(blog.id));
      if (success) {
        dispatch(setNotificationWithTimeout("Blog deleted successfully", "success", 5));
      } else {
        dispatch(setNotificationWithTimeout("Failed to delete blog", "error", 5));
      }
    };

  return (
    <div>
      <h1>Blogs</h1>
      <Notification />

      {user === null ? (
        loginForm()
      ) : (
        <div>
          <h2>
            {user.name} logged in
            <button onClick={handleLogout}>Logout</button>
          </h2>

          {blogForm()}

          {blogs
            .slice()
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                handleLike={handleLike}
                handleRemove={handleRemove}
                user={user}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default App;
