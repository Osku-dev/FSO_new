import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries';
import { useState } from 'react';

const Books = ({ show }) => {
  const [selectedGenre, setSelectedGenre] = useState(null);

  const { loading, data, error } = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre },
    fetchPolicy: 'cache-first',
  });

  if (!show) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching books</div>;
  }

  if (!data || !data.allBooks) {
    return <div>No books found</div>;
  }

  const genres = data.allBooks
    .map((book) => book.genres)
    .flat()
    .map((genre) => genre.toLowerCase())
    .filter((genre, index, self) => self.indexOf(genre) === index);

  const displayedGenres = selectedGenre
    ? [selectedGenre] 
    : genres;         

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre.toLowerCase());
  };

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
          {data.allBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Filter by genre</h3>
      <div>
        {displayedGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenreClick(genre)}
            disabled={selectedGenre === genre}
          >
            {genre}
          </button>
        ))}
        <button onClick={() => setSelectedGenre(null)}>Show all</button>
      </div>
    </div>
  );
};

export default Books;
