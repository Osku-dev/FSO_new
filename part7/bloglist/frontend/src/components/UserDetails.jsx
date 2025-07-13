import { useLocation } from 'react-router-dom';

const UserDetails = () => {
  const location = useLocation();
  const { user: userDetails } = location.state;

  if (!userDetails) return <div>Loading...</div>;

  return (
    <div>
      <h2>{userDetails.name}</h2>
      <h3>Blogs</h3>
      <ul>
        {userDetails.blogs.map(blog => (
          <li key={blog.id}>
            <strong>{blog.title}</strong> by {blog.author}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDetails;