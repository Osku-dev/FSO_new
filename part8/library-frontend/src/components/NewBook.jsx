import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ALL_AUTHORS, ALL_BOOKS, ADD_BOOK } from "../queries";

const NewBook = ({ show, setErrorMessage }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const [addBook] = useMutation(ADD_BOOK, {
    onError: (error) => {
      console.log("Error occurred during mutation: ", error);
      setErrorMessage(error.graphQLErrors[0]?.message || "An error occurred");
      setTimeout(() => setErrorMessage(""), 5000);
    },

    refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS , variables: { genre: null } }],
    awaitRefetchQueries: true,

    update: (cache, response) => {

      cache.updateQuery({ query: ALL_BOOKS , variables: { genre: null } }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(response.data.addBook),
        };
      });
    },

    onCompleted: () => {
      console.log("Book added successfully!");
    },
  });

  if (!show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    const publishedYear = parseInt(published);
    try {
      await addBook({
        variables: {
          title,
          author,
          published: publishedYear,
          genres,
        },
      });

      setTitle("");
      setAuthor("");
      setPublished("");
      setGenres([]);
      setGenre("");
    } catch (error) {
      setErrorMessage("Failed to add book:", error);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const addGenre = () => {
    if (genre.trim()) {
      setGenres(genres.concat(genre.trim()));
      setGenre("");
    }
  };

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
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
