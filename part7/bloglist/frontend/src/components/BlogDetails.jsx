import { useParams } from "react-router-dom";
import { useSelector} from "react-redux";

const BlogDetails = ({ handleLike, handleRemove, user }) => {
  const { id } = useParams();
  const blog = useSelector((state) =>
    state.blogs.find((blog) => blog.id === id)
  );

  if (!blog) return <p>Blog not found</p>;
  console.log(blog);

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
    </div>
  );
};

export default BlogDetails;