import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const serveurUrl = import.meta.env.VITE_API_SERVER_URL;

const Layout = (): JSX.Element => {
  const [token, setToken] = useState<string | null>();
  const { logout, getAccessTokenSilently, user } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (user != null) {
      handleToken();
    }
  }, [user]);

  const handleToken = async () => {
    const tokenFromAuth = await getAccessTokenSilently();
    setToken(tokenFromAuth);
  };

  const handleLogout = (): void => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const handleDeleteMe = async () => {
    try {
      await fetch(serveurUrl + "/users", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      handleLogout();
    } catch (error) {
      console.error("une erreur");
    }
  };

  return (
    <div>
      <div>
        header - {user?.email} - <button onClick={handleDeleteMe}>Delete my account</button>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={() => navigate("/create-event")}>Create event</button>
      </div>
      <div>
        {" "}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
