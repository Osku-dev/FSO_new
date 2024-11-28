import { useState, useEffect } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import Notify from "./components/Notify";
import Recommendations from "./components/Recommendations";
import { useApolloClient, useSubscription } from "@apollo/client";
import { BOOK_ADDED, ALL_BOOKS } from "./queries.js";

export const updateCache = (cache, query, addedBook) => {
  const uniqById = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.id;
      return seen.has(k) ? false : seen.add(k);
    });
  };

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqById(allBooks.concat(addedBook)),
    };
  });
};

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const client = useApolloClient();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(true);
    }
  }, []);

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded;
      window.alert(`${addedBook.title} added`);
      updateCache(
        client.cache,
        { query: ALL_BOOKS, variables: { genre: null } },
        addedBook
      );
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    client.resetStore();
  };

  return (
    <div>
      <div>
        {token ? (
          <>
            <button onClick={() => setPage("authors")}>authors</button>
            <button onClick={() => setPage("books")}>books</button>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommendations")}>
              recommend
            </button>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => setPage("authors")}>authors</button>
            <button onClick={() => setPage("books")}>books</button>
            <button onClick={() => setPage("login")}>login</button>
          </>
        )}
      </div>

      <Notify message={errorMessage} />

      <Authors
        token={token}
        show={page === "authors"}
        setErrorMessage={setErrorMessage}
      />

      <Books show={page === "books"} setErrorMessage={setErrorMessage} />

      <NewBook show={page === "add"} setErrorMessage={setErrorMessage} />

      <Recommendations show={page === "recommendations"} />

      <Login
        setToken={setToken}
        show={page === "login"}
        setPage={setPage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

export default App;
