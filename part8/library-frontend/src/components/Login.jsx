import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../queries"; 

const Login = ({ setToken, show, setPage, setErrorMessage }) => {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      setErrorMessage(error.graphQLErrors[0].message)
      setTimeout(() => setErrorMessage(""), 5000); 
    }
  })

  useEffect(() => {
    if ( result.data ) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('token', token)
    }
  }, [result.data])

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await login({ variables: { username: loginUsername, password: loginPassword } });
      setPage("authors")
    } catch (error) {
      setErrorMessage("Login failed", error);
    }
  };

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={loginUsername}
            onChange={({ target }) => setLoginUsername(target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={({ target }) => setLoginPassword(target.value)}
          />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
