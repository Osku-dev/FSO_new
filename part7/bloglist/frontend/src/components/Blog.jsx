import React from 'react'
import { Link } from "react-router-dom";

const Blog = ({ blog, handleLike, handleRemove, user }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className="blog">
      <div>
        <p>
        <Link to={`/blogs/${blog.id}`}>{blog.title}{blog.title} {blog.author}</Link>
          </p>
    </div>
    </div>
  )
}

export default Blog
