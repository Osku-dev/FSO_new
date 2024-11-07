import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'
import { useDispatch } from 'react-redux'
import { setNotificationWithTimeout } from './reducers/notificationReducer'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)


  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

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
    )
  }

  const blogFormRef = useRef()

  const blogForm = () => {
    return (
      <div>
        <Togglable buttonLabel="Create New Blog">
          <BlogForm handleCreateBlog={handleCreateBlog} ref={blogFormRef} />
        </Togglable>
      </div>
    )
  }

  const dispatch = useDispatch()


  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      dispatch(setNotificationWithTimeout('Login successful', 'success', 5))
    } catch (exception) {
      dispatch(setNotificationWithTimeout('Incorrect username or password', 'error', 5))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    dispatch(setNotificationWithTimeout('Logged out successfully', 'success', 5))
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()
    const newBlog = blogFormRef.current.getNewBlog()
    try {
      const returnedBlog = await blogService.createBlog(newBlog)

      const updatedBlog = {
        ...returnedBlog,
        user: {
          user: returnedBlog.user,
          username: user.username
        },
      }
      setBlogs((prevBlogs) =>
        prevBlogs.concat(updatedBlog)
      )
      blogFormRef.current.clearInputFields()
      dispatch(setNotificationWithTimeout('New blog created successfully', 'success', 5))
    } catch (exception) {
      dispatch(setNotificationWithTimeout('Failed to create new blog', 'error', 5))
    }
  }

  const handleLike = async (id) => {
    try {
      const blogToUpdate = blogs.find((b) => b.id === id)

      const updatedBlog = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1,
      }

      const returnedBlog = await blogService.updateBlog(id, updatedBlog)

      const updatedBlogWithUser = {
        ...returnedBlog,
        user: blogToUpdate.user,
      }

      setBlogs((prevBlogs) =>
        prevBlogs.map((b) => (b.id !== id ? b : updatedBlogWithUser))
      )
    } catch (exception) {
      console.error('Error updating likes: ', exception)
    }
  }

  const handleRemove = async (blog) => {
    try {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete the blog "${blog.title}" by ${blog.author}?`
      )
      if (!confirmDelete) {
        return
      }

      await blogService.deleteBlog(blog.id)

      setBlogs(blogs.filter((b) => b.id !== blog.id))

      dispatch(setNotificationWithTimeout('Blog deleted successfully', 'success', 5))
    } catch (exception) {
      console.error('Error deleting blog: ', exception)
      dispatch(setNotificationWithTimeout('Failed to delete blog', 'error', 5))
    }
  }

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
  )
}

export default App
