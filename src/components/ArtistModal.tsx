import { useAuth0 } from "@auth0/auth0-react";
import {
  Button,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Artist } from "../types/types";
import { serverUrl } from "../utils/server";

type ArtistModalProps = {
  isOpen: boolean;
  onModalClose: () => void;
  onCreateArtist: (artist: Artist) => void;
};

const ArtistModal: React.FC<ArtistModalProps> = ({ isOpen = false, onModalClose, onCreateArtist }) => {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Artist>();
  const { getAccessTokenSilently } = useAuth0();

  const onSubmit: SubmitHandler<Artist> = async (data) => {
    try {
      const token = await getAccessTokenSilently();
      const rawResponse = await fetch(serverUrl + "/artists/new", {
        method: "POST",
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
      if (response.error) {
        toast({
          title: response.error,
          status: "error",
          isClosable: true,
        });
      } else if (response.body) {
        toast({
          title: '"Artist created',
          status: "success",
          isClosable: true,
        });
        onCreateArtist(response.body);
        onModalClose();
        reset();
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onModalClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Add new artist</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* NAME */}
            <FormLabel>Artist or company name&nbsp;*</FormLabel>
            <Input {...register("name", { required: true })} />
            {errors.name && (
              <Text fontSize="xs" color="red">
                Name is required
              </Text>
            )}
            {/* URLS */}
            <FormLabel>Socials</FormLabel>
            <HStack spacing={3}>
              <Text>Instagram</Text>
              <Input {...register("urls.instagramUrl")} />
            </HStack>
            <HStack spacing={3}>
              <Text>Facebook</Text>
              <Input {...register("urls.facebookUrl")} />
            </HStack>
            <HStack spacing={3}>
              <Text>Youtube</Text>
              <Input {...register("urls.youtubeUrl")} />
            </HStack>
            {/* LOCATION */}
            <FormLabel>Location</FormLabel>
            <HStack spacing={3}>
              <Text>Country&nbsp;*</Text>
              <Input {...register("location.country", { required: true })} />
              {errors.location?.country && (
                <Text fontSize="xs" color="red">
                  Country is required
                </Text>
              )}
            </HStack>
            <HStack spacing={3}>
              <Text>City</Text>
              <Input {...register("location.city")} />
            </HStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onModalClose}>
              Close
            </Button>
            <Button type="submit" title="Create" value="Create">
              Create
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ArtistModal;
