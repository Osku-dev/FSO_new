import React from 'react'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

// Define mock data for the blog and user
const blog = {
  title: 'Sample Blog Title',
  author: 'John Doe',
  url: 'https://example.com',
  likes: 10,
  user: {
    name: 'John Doe',
    username: 'johndoe',
  },
}

const user = {
  username: 'johndoe',
}

let container
let handleLikeMock
let handleRemoveMock

beforeEach(() => {
  // Assign the rendered component to container for reuse in tests
  handleLikeMock = vi.fn()
  handleRemoveMock = vi.fn()

  container = render(
    <Blog
      blog={blog}
      user={user}
      handleLike={handleLikeMock}
      handleRemove={handleRemoveMock}
    />
  ).container
})

describe('<Blog />', () => {
  test('renders title and author by default', () => {
    // Check if title and author are in the document
    expect(screen.getByText('Sample Blog Title John Doe')).toBeInTheDocument()

    // Ensure the blog's url, likes, and user name are not shown by default
    expect(screen.queryByText('https://example.com')).not.toBeInTheDocument()
    expect(screen.queryByText('10')).not.toBeInTheDocument()
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
  })
})