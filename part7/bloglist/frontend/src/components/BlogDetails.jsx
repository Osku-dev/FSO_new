import { useParams } from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
import { addComment } from "../reducers/blogReducer";
import { useState} from "react";

const BlogDetails = ({ handleLike, handleRemove, user }) => {
  const { id } = useParams();
  const blog = useSelector((state) =>
    state.blogs.find((blog) => blog.id === id)
  );
  const dispatch = useDispatch();

  const [comment, setComment] = useState('');

  const handleAddComment = (e) => {
    e.preventDefault();
    if (comment.trim() === '') return;
    dispatch(addComment(blog.id, comment));
    setComment(''); 
  };

  if (!blog) return <p>Blog not found</p>;

  const isCreator = user?.id === blog.user?.id;

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>Author: {blog.author}</p>
      <p>
        URL: <a href={blog.url}>{blog.url}</a>
      </p>
      <p>Likes: {blog.likes} <button onClick={() => handleLike(blog.id)}>Like</button></p>
      <p>Added by: {blog.user?.name || "Unknown"}</p>
      {isCreator && (
        <button onClick={() => handleRemove(blog)} style={{ color: "red" }}>
          Remove
        </button>
      )}
      <h3>Comments</h3>
      <ul>
        {blog.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>

      {user && (
        <form onSubmit={handleAddComment}>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
          />
          <button type="submit">Add Comment</button>
        </form>
      )}
    </div>
  );
};

export default BlogDetails;