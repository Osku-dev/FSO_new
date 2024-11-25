import { useState, useEffect } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import Notify from "./components/Notify";
import { useApolloClient } from '@apollo/client';


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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    client.resetStore()
  };

  return (
    <div>
       <div>
          {token ? (
            <>
              <button onClick={() => setPage("authors")}>authors</button>
              <button onClick={() => setPage("books")}>books</button>
              <button onClick={() => setPage("add")}>add book</button>
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

      <Authors token={token} show={page === "authors"} setErrorMessage={setErrorMessage} />

      <Books show={page === "books"} setErrorMessage={setErrorMessage} />

      <NewBook show={page === "add"} setErrorMessage={setErrorMessage} />

      <Login setToken={setToken} show={page === "login"} setPage={setPage} setErrorMessage={setErrorMessage} />
    </div>
  );
};

export default App;
