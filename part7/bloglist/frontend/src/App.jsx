import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import Notification from "./components/Notification";
import Users from "./components/Users";
import Header from "./components/Header";
import BlogDetails from "./components/BlogDetails";
import blogService from "./services/blogs";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { setNotificationWithTimeout } from "./reducers/notificationReducer";
import {
  fetchBlogs,
  createBlog,
  likeBlog,
  deleteBlog,
} from "./reducers/blogReducer";
import { loginUser, logoutUser, setUser } from "./reducers/userReducer";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import UserDetails from "./components/UserDetails";
import { Table } from "react-bootstrap";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBlogs());
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
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
      const success = await dispatch(loginUser({ username, password }));
      if (success) {
        dispatch(setNotificationWithTimeout("Login successful", "success", 5));
        setUsername("");
        setPassword("");
      } else {
        dispatch(
          setNotificationWithTimeout(
            "Incorrect username or password",
            "danger",
            5
          )
        );
      }
    } catch (exception) {
      dispatch(setNotificationWithTimeout("Login failed", "danger", 5));
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(
      setNotificationWithTimeout("Logged out successfully", "success", 5)
    );
  };

  const handleCreateBlog = async (event) => {
    event.preventDefault();
    const newBlog = blogFormRef.current.getNewBlog();

    const success = await dispatch(createBlog(newBlog));
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
        setNotificationWithTimeout("Failed to create new blog", "danger", 5)
      );
    }
  };

  const handleLike = async (id) => {
    const success = await dispatch(likeBlog(id));

    if (!success) {
      dispatch(setNotificationWithTimeout("Error updating likes", "danger", 5));
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
      dispatch(
        setNotificationWithTimeout("Blog deleted successfully", "success", 5)
      );
    } else {
      dispatch(setNotificationWithTimeout("Failed to delete blog", "danger", 5));
    }
  };

  return (
    <div className="container">
      <Router>
        <Routes>
          <Route
            element={
              <>
                <Header
                  user={user}
                  handleLogout={handleLogout}
                  loginForm={loginForm}
                />
                <h1>Blogs</h1>
                <Notification />
                <Outlet />
              </>
            }
          >
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<UserDetails />} />
            <Route
              path="/blogs/:id"
              element={
                <BlogDetails
                  handleLike={handleLike}
                  handleRemove={handleRemove}
                  user={user}
                />
              }
            />
            <Route
              path="/"
              element={
                <div>
                  {user ? blogForm() : <></>}
                  <Table striped>
                    <tbody>
                      {blogs
                        .slice()
                        .sort((a, b) => b.likes - a.likes)
                        .map((blog) => (
                          <tr key={blog.id}>
                            <td colSpan="3">
                              <Blog blog={blog} />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </div>
              }
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
