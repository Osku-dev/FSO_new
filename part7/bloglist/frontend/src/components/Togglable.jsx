import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const Togglable = (props) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };
  const buttonStyle = { margin: '10px 0' };
  const containerStyle = { marginTop: '20px' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div style={containerStyle}>
      <div style={hideWhenVisible}>
        <Button style={buttonStyle} onClick={toggleVisibility}>
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button style={buttonStyle} onClick={toggleVisibility}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default Togglable;