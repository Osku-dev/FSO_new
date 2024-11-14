import { Link } from 'react-router-dom';

const Header = ({ user, handleLogout, loginForm }) => (
  <div style={{ backgroundColor: '#D3D3D3', padding: '10px' }}>
    <div style={{ marginBottom: '10px' }}>
      <Link to="/" style={{ marginRight: '15px' }}>Blogs</Link>
      <Link to="/users" style={{ marginRight: '15px' }}>Users</Link>
    </div>

    {user ? (
      <h2>
        {user.name} logged in
        <button onClick={handleLogout}>Logout</button>
      </h2>
    ) : (
      loginForm()
    )}
  </div>
);

export default Header;