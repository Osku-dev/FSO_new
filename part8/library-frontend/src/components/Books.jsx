import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = ({show}) => {
  const result = useQuery(ALL_BOOKS)
  
  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  if (!result.data || !result.data.allBooks) {
    return <div>No books found</div>
  }

  return (
    <div>
      <h2>Books</h2>

      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {result.data.allBooks.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author ? book.author.name : 'Unknown'}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books