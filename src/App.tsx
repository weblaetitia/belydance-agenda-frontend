import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import "./App.css";
import AppRouter from "./Router";
import { serverUrl } from "./utils/server";

const App: React.FC = () => {
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

  const handleToken = async (): Promise<void> => {
    const tokenFromAuth = await getAccessTokenSilently();
    setToken(tokenFromAuth);
  };

  const handleInit = async (): Promise<void> => {
    try {
      await fetch(serverUrl + "/users/init", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("une erreur");
    }
  };

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (error) {
    handleLogout();
    console.error("Authentication error");
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
