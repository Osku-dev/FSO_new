import React from 'react'
import { Link } from "react-router-dom";

const Blog = ({ blog }) => {

  

  return (
    <div>
      <div>
        <p>
        <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
          </p>
    </div>
    </div>
  )
}

export default Blog
