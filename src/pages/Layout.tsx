import { useAuth0 } from "@auth0/auth0-react";
import { Button, HStack } from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";

const Layout = (): JSX.Element => {
  const { logout, user } = useAuth0();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <div>
      <HStack>
        <Button onClick={() => navigate("/")}>Home</Button>
        <Button onClick={() => navigate("/events/create")}>Create event</Button>
        <Button onClick={() => navigate("/events/list")}>Event list</Button>
        <Button onClick={() => navigate("/user")}>My profile</Button>
        <Button onClick={handleLogout}>Logout</Button>
      </HStack>
      <div>
        {" "}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
