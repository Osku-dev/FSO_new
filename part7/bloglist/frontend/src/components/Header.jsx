import { Link } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';

const Header = ({ user, handleLogout, loginForm }) => (
  <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link as="span">
          <Link to="/" style={{ color: 'white', marginRight: '15px' }}>Blogs</Link>
        </Nav.Link>
        <Nav.Link as="span">
          <Link to="/users" style={{ color: 'white', marginRight: '15px' }}>Users</Link>
        </Nav.Link>
      </Nav>

      <Nav>
        {user ? (
          <Nav.Link as="span" style={{ color: 'white' }}>
            <em>{user.name} logged in</em>
            <Button onClick={handleLogout} variant="outline-light" style={{ marginLeft: '10px' }}>Logout</Button>
          </Nav.Link>
        ) : (
          <Nav.Link as="span" style={{ color: 'white' }}>
            {loginForm()}
          </Nav.Link>
        )}
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default Header;