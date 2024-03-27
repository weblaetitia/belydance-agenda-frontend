import { User, useAuth0 } from "@auth0/auth0-react";
import { Button, Divider, FormLabel, Image, Input, useToast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../utils/server";

const UserProfile = () => {
  const { logout, getAccessTokenSilently, user } = useAuth0();
  const toast = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit: handleSubmit } = useForm<User>({
    defaultValues: { name: user?.name, nickname: user?.nickname, email: user?.email },
  });

  const onSubmit = async (data: User): Promise<void> => {
    console.log(data);
    const token = await getAccessTokenSilently();
    const rawResponse = await fetch(serverUrl + "/users", {
      method: "PATCH",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const response = await rawResponse.json();
    // TODO: write new user informations in redux states as auth0 won't update it
    navigate("/");
    toast({
      title: response.message,
      status: "success",
      isClosable: true,
    });
  };
  const handleLogout = (): void => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };
  const handleDeleteMe = async (): Promise<void> => {
    try {
      const token = await getAccessTokenSilently();
      const rawResponse = await fetch(serverUrl + "/users", {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await rawResponse.json();
      if (response.error) {
        toast({
          title: response.error,
          status: "error",
          isClosable: true,
        });
      } else {
        toast({
          title: response.message,
          status: "success",
          isClosable: true,
        });
        handleLogout();
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Update profile</h1>
      {user?.picture != null && <Image src={user?.picture} alt={user?.nickname} sizes="100" />}
      {/* name */}
      <FormLabel htmlFor="name">Name</FormLabel>
      <Input placeholder="Name" {...register("name", { required: true })} />
      {/* nickname */}
      <FormLabel htmlFor="nickname">nickname</FormLabel>
      <Input placeholder="nickname" {...register("nickname", { required: true })} />
      {/* email */}
      <FormLabel htmlFor="email">email</FormLabel>
      <Input placeholder="email" {...register("email", { required: true, disabled: true })} />
      {/* submit */}
      <Input type="submit" title="submit" value="Update profile" />
      <Divider />
      <Button onClick={handleDeleteMe}>Delete my account</Button>
      <Button onClick={() => logout()}>Log out</Button>
    </form>
  );
};

export default UserProfile;
