import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import './App.css';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  });
  const [message, setMessage] = useState(null); 
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const displayMessage = (messageText, type) => {
    setMessage(messageText);
    setMessageType(type);

    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      displayMessage("Login successful", 'success');
    } catch (exception) {
      displayMessage("Incorrect username or password", 'error');
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
    displayMessage("Logged out successfully", 'success');
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewBlog({ ...newBlog, [name]: value });
  };

  const handleCreateBlog = async (event) => {
    event.preventDefault();
    try {
      const returnedBlog = await blogService.createBlog(newBlog);
      setBlogs(blogs.concat(returnedBlog));
      setNewBlog({ title: '', author: '', url: '' });
      displayMessage("New blog created successfully", 'success');
    } catch (exception) {
      displayMessage("Failed to create new blog", 'error');
    }
  };

  return (
    <div>
      <h1>Blogs</h1>
      {message && (
        <div className={`${messageType}`}>
          {message}
        </div>
      )}

      {user === null ? (
        <div>
          <h2>Log in to application</h2>
          <form onSubmit={handleLogin}>
            <div>
              username
              <input
                type="text"
                value={username}
                name="Username"
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div>
              password
              <input
                type="password"
                value={password}
                name="Password"
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <button type="submit">login</button>
          </form>
        </div>
      ) : (
        <div>
          <h2>
            {user.name} logged in
            <button onClick={handleLogout}>Logout</button>
          </h2>

          <h2>Create New</h2>
          <form onSubmit={handleCreateBlog}>
            <div>
              Title:
              <input
                type="text"
                name="title"
                value={newBlog.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              Author:
              <input
                type="text"
                name="author"
                value={newBlog.author}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              URL:
              <input
                type="text"
                name="url"
                value={newBlog.url}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit">Create</button>
          </form>

          {blogs
            .filter((blog) => blog.user && blog.user.username === user.username)
            .map((blog) => (
              <Blog key={blog.id} blog={blog} />
            ))}
        </div>
      )}
    </div>
  );
};

export default App;
