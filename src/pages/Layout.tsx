import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const serverUrl = import.meta.env.VITE_API_SERVER_URL;

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
      await fetch(serverUrl + "/users", {
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
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/events/create")}>Create event</button>
        <button onClick={() => navigate("/events/list")}>Event list</button>
        {user?.email}
        <button onClick={handleDeleteMe}>Delete my account</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div>
        {" "}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
