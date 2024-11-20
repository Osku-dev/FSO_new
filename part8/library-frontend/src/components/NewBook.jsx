import { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import {ALL_AUTHORS, ALL_BOOKS} from '../queries'

const ADD_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      title
      author
      published
    }
  }
`

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [addBook] = useMutation(ADD_BOOK, {
    onError: (error) => {
      console.error(error.graphQLErrors[0]?.message || 'An error occurred')
    },
    onCompleted: () => {
      console.log('Book added successfully!')
    },
    refetchQueries: [
      { query: ALL_AUTHORS }, 
      { query: ALL_BOOKS },   
    ],
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    const publishedYear = parseInt(published, 10)
    try {
      await addBook({
        variables: {
          title,
          author,
          published: publishedYear,
          genres,
        },
      })

      setTitle('')
      setAuthor('')
      setPublished('')
      setGenres([])
      setGenre('')
    } catch (error) {
      console.error('Failed to add book:', error)
    }
  }

  const addGenre = () => {
    if (genre.trim()) {
      setGenres(genres.concat(genre.trim()))
      setGenre('')
    }
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
