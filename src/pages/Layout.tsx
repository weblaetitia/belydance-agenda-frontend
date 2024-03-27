import { useAuth0 } from "@auth0/auth0-react";
import { Outlet, useNavigate } from "react-router-dom";

const Layout = (): JSX.Element => {
  const { logout, user } = useAuth0();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <div>
      <div>
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/events/create")}>Create event</button>
        <button onClick={() => navigate("/events/list")}>Event list</button>
        {user?.nickname}
        <button onClick={() => navigate("/user")}>My profile</button>
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
