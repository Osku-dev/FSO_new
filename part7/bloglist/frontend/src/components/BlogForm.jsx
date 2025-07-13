import { useState, useImperativeHandle, forwardRef } from 'react';
import { Form, Button } from 'react-bootstrap';

const BlogForm = forwardRef((props, ref) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewBlog({ ...newBlog, [name]: value });
  };

  const clearInputFields = () => {
    setNewBlog({ title: '', author: '', url: '' });
  };

  useImperativeHandle(ref, () => {
    return {
      clearInputFields,
      getNewBlog: () => newBlog,
    };
  });

  return (
    <div>
      <h2>Create New</h2>

      <Form onSubmit={props.handleCreateBlog}>
        <Form.Group controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={newBlog.title}
            onChange={handleInputChange}
            placeholder="Title"
            required
          />
        </Form.Group>

        <Form.Group controlId="formAuthor">
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            name="author"
            value={newBlog.author}
            onChange={handleInputChange}
            placeholder="Author"
            required
          />
        </Form.Group>

        <Form.Group controlId="formUrl">
          <Form.Label>URL</Form.Label>
          <Form.Control
            type="text"
            name="url"
            value={newBlog.url}
            onChange={handleInputChange}
            placeholder="URL"
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Create
        </Button>
      </Form>
    </div>
  );
});

BlogForm.displayName = 'BlogForm';

export default BlogForm;