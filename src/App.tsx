import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import "./App.css";
import AppRouter from "./Router";

const serveurUrl = import.meta.env.VITE_API_SERVER_URL;

const App = () => {
  const [token, setToken] = useState<string | null>();
  const { isLoading, error, user, loginWithRedirect, logout, isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (user) {
      handleToken();
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      handleInit();
    }
  }, [token]);

  const handleLogout = (): void => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const handleToken = async () => {
    const tokenFromAuth = await getAccessTokenSilently();
    setToken(tokenFromAuth);
  };

  const handleInit = async () => {
    try {
      await fetch(serveurUrl + "/users/init", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("une erreur");
    }
  };

  console.log(user);

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
        <button onClick={() => loginWithRedirect()}> Login</button>
      </>
    );
  }

  return (
    <>
      <AppRouter />
    </>
  );
};

export default App;
