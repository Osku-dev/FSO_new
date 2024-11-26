import { useQuery } from '@apollo/client';
import { ALL_BOOKS, ME } from '../queries';

const Recommendations = ({ show }) => {
  const { loading: userLoading, data: userData, error: userError } = useQuery(ME);
  const favoriteGenre = userData?.me?.favoriteGenre;

  const { loading: booksLoading, data: booksData, error: booksError } = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre || null },
    skip: !favoriteGenre, 
  });

  if (!show) {
    return null;
  }

  if (userLoading) {
    return <div>Loading user data...</div>;
  }

  if (userError) {
    return <div>Error fetching user data</div>;
  }

  if (!favoriteGenre) {
    return <div>No favorite genre found</div>;
  }

  if (booksLoading) {
    return <div>Loading recommendations...</div>;
  }

  if (booksError || !booksData?.allBooks) {
    return <div>Error fetching recommendations</div>;
  }

  return (
    <div>
      <h2>Recommendations</h2>
      <p>Books in your favorite genre: <strong>{favoriteGenre}</strong></p>

      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {booksData.allBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;

