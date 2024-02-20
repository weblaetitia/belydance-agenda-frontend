import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import "./App.css";

const serveurUrl = import.meta.env.VITE_API_SERVER_URL;

const App = () => {
  const [token, setToken] = useState<string | null>();
  const {
    isLoading,
    error,
    user,
    loginWithRedirect,
    logout,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();

  useEffect(() => {
    if (user != null) {
      handleToken();
    }
  }, [user]);

  const handleLogout = (): void => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const handleToken = async () => {
    const tokenFromAuth = await getAccessTokenSilently();
    setToken(tokenFromAuth);
  };

  const handleFetchPublic = async () => {
    // without authentication
    try {
      const responseWithAuth = await fetch(serveurUrl + "/public", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const jsonDataPrivate = await responseWithAuth.json();
      console.log(jsonDataPrivate);
    } catch (error) {
      console.error("une erreur");
    }
  };
  const handleFetchPrivate = async () => {
    // with authentication
    try {
      const responseWithAuth = await fetch(serveurUrl + "/private", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const jsonDataPrivate = await responseWithAuth.json();
      console.log(jsonDataPrivate);
    } catch (error) {
      console.log("oh oh bummer");
    }
  };
  const handleFetchUsers = async () => {
    // with authentication
    try {
      const responseWithAuth = await fetch(serveurUrl + "/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const jsonDataPrivate = await responseWithAuth.json();
      console.log(jsonDataPrivate);
    } catch (error) {
      console.log("oh oh bummer");
    }
  };

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (error) {
    handleLogout();
    console.log("Authentication error");
    return <p>Error!</p>;
  }

  if (!isAuthenticated) {
    return (
      <>
        <button onClick={() => loginWithRedirect()}>Log In</button>
        <br />
        <button onClick={() => handleFetchPublic()}>Fetch public</button>
        <br />
        <button onClick={() => handleFetchPrivate()}>Fetch private</button>
      </>
    );
  }

  return (
    <>
      <p>{user?.email}</p>
      <button onClick={() => logout()}>Log Out</button>
      <br />
      <button onClick={() => handleFetchPublic()}>Fetch public</button>
      <br />
      <button onClick={() => handleFetchPrivate()}>Fetch private</button>
      <br />
      <button onClick={() => handleFetchUsers()}>Fetch users</button>
    </>
  );
};

export default App;
