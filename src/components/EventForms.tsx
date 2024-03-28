import { useAuth0 } from "@auth0/auth0-react";
import { Button, Checkbox, FormLabel, HStack, Input, Select, Text, Textarea } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Artist, Event, OsmPlace } from "../types/types";
import { serverUrl } from "../utils/server";
import ArtistModal from "./ArtistModal";
import SearchPlace from "./SearchPlace";

type EventFormDetailsProps = {
  event?: Event;
  onNext: (data: EventInputs) => void;
};

export const EventFormDetails: React.FC<EventFormDetailsProps> = ({ event, onNext }) => {
  const [artistSelected, setArtistSelected] = useState<Artist[] | undefined>(event ? event.artists : undefined);
  const [artistsFound, setArtistsFound] = useState<Artist[] | null>();
  const [artistModalOpen, setArtistModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<OsmPlace | undefined>();

  const { getAccessTokenSilently } = useAuth0();

  const {
    register,
    handleSubmit: handleNext,
    formState: { errors },
    setValue,
  } = useForm<EventInputs>();

  useEffect(() => {
    if (event != null) {
      setValue("name", event.name);
      setValue("imageUrl", event.imageUrl);
      setValue("facebookUrl", event.facebookUrl);
      setValue("eventTypes", event.eventTypes);
      setValue("danceTypes", event.danceTypes);
      // TODO Artist
      setValue("location", event.location);
      if (event.startDate) {
        setValue("startDate", formatDate(event.startDate));
        setValue("startHour", formatHour(event.startDate));
      }

      if (event.endDate) {
        setValue("endDate", formatDate(event.endDate));
        setValue("endHour", formatHour(event.endDate));
      }
      setValue("isFree", event.isFree);
      if (event.vendorUrl) setValue("vendorUrl", event.vendorUrl);
      if (event.organizerEmail) setValue("organizerEmail", event.organizerEmail);
    }
  }, [event]);

  const searchArtist = async (artistInput: string) => {
    if (artistInput == null) return;
    try {
      const token = await getAccessTokenSilently();
      const rawResponse = await fetch(serverUrl + "/artists/" + artistInput, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await rawResponse.json();
      setArtistsFound(response.body);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit: SubmitHandler<EventInputs> = (data) => {
    if (artistSelected == null) {
      onNext(data);
    } else {
      const artistIds = artistSelected?.map((artist) => artist.id);
      onNext({ ...data, artists: artistIds, location: selectedPlace });
    }
  };

  const onSelectArtist = (artist: Artist): void => {
    if (artistSelected == null) {
      setArtistSelected([artist]);
    } else {
      setArtistSelected([...artistSelected, artist]);
    }
    setArtistsFound(null);
  };

  const onRemoveArtist = (artistToRemove: Artist) => {
    setArtistSelected(artistSelected?.filter((artist) => artist.id != artistToRemove.id));
  };

  return (
    <div>
      <form onSubmit={handleNext(onSubmit)}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* NAME */}
          <FormLabel htmlFor="name">Event name:</FormLabel>
          <Input placeholder="Event name" {...register("name", { required: true })} />
          {errors.name && <span>This field is required</span>}
          {/* EVENT PLACE */}
          <SearchPlace onSelectPlace={setSelectedPlace} initialPlace={event != null ? event.location : undefined} />
          {/* EVENT TYPE */}
          <FormLabel htmlFor="eventType">Event type:</FormLabel>
          <HStack>
            <HStack>
              <input type="checkbox" value="workshop" {...register("eventTypes")} />
              <Text>Workshop</Text>
            </HStack>
            <HStack>
              <input type="checkbox" value="festival" {...register("eventTypes")} />
              <Text>festival</Text>
            </HStack>
            <HStack>
              <input type="checkbox" value="show" {...register("eventTypes")} />
              <Text>show</Text>
            </HStack>
            <HStack>
              <input type="checkbox" value="hafla" {...register("eventTypes")} />
              <Text>hafla</Text>
            </HStack>
            <HStack>
              <input type="checkbox" value="gathering" {...register("eventTypes")} />
              <Text>gathering</Text>
            </HStack>
          </HStack>
          {/* STYLE */}
          <FormLabel htmlFor="danceTypes">Choose a style:</FormLabel>
          <HStack>
            <HStack>
              <input type="checkbox" value="fusion" {...register("danceTypes")} />
              <Text>fusion</Text>
            </HStack>
            <HStack>
              <input type="checkbox" value="fcbd" {...register("danceTypes")} />
              <Text>fcbd</Text>
            </HStack>
            <HStack>
              <input type="checkbox" value="datura" {...register("danceTypes")} />
              <Text>datura</Text>
            </HStack>
            <HStack>
              <input type="checkbox" value="its" {...register("danceTypes")} />
              <Text>its</Text>
            </HStack>
            <HStack>
              <input type="checkbox" value="other" {...register("danceTypes")} />
              <Text>other</Text>
            </HStack>
          </HStack>
          {/* ARTISTS */}
          <FormLabel htmlFor="search Artist">Artist:</FormLabel>
          {artistSelected && (
            <HStack>
              {artistSelected.map((artist, i) => (
                <Button key={i}>
                  {artist.name} <span onClick={() => onRemoveArtist(artist)}>X</span>
                </Button>
              ))}
            </HStack>
          )}
          <Text>Search for artist in the database:</Text>
          <Input placeholder="Type artist name" onChange={(e) => searchArtist(e.target.value)} />{" "}
          {artistsFound && (
            <ul>
              {artistsFound.map((artist, i) => (
                <li key={i}>
                  {artist.name} <button onClick={() => onSelectArtist(artist)}>Add</button>
                </li>
              ))}
            </ul>
          )}
          <Text>
            Can't find your artist? <Button onClick={() => setArtistModalOpen(true)}>Create new</Button>
          </Text>
          {/* DATE */}
          <FormLabel>When does your event start and end? *</FormLabel>
          <Input type="date" id="startDate" {...register("startDate")} min="2023-03-01" />
          <Select placeholder="Starting hour" id="startHour" {...register("startHour")}>
            <option value="00:00">00:00</option>
            <option value="00:15">00:15</option>
            <option value="00:30">00:30</option>
          </Select>
          <Input type="date" id="endDate" {...register("endDate")} min="2023-03-01" />
          <Select placeholder="Ending hour" id="endHour" {...register("endHour")}>
            <option value="00:00">00:00</option>
            <option value="00:15">00:15</option>
            <option value="00:30">00:30</option>
          </Select>
          {/* FREE */}
          <FormLabel htmlFor="isFree">Is your event free?</FormLabel>
          <Checkbox {...register("isFree")}>Free</Checkbox>
          {/* FACEBOOK */}
          <FormLabel htmlFor="facebookUrl">Facebook event URL:</FormLabel>
          <Input placeholder="Facebook event url" {...register("facebookUrl")} />
          {/* WEBSITE */}
          <FormLabel htmlFor="websiteUrl">Website for more informations</FormLabel>
          <Input {...register("websiteUrl")} />
          {/* VENDOR */}
          <FormLabel htmlFor="vendorUrl">Tickets vendor url</FormLabel>
          <Input {...register("vendorUrl")} />
          {/* ORGANIZER */}
          <FormLabel htmlFor="organizerEmail">Organizer email</FormLabel>
          <Input {...register("organizerEmail")} />
          {/* SUBMIT */}
          <Input type="submit" title="Next" value="Next" />
        </div>
      </form>
      <ArtistModal isOpen={artistModalOpen} onModalClose={() => setArtistModalOpen(false)} onCreateArtist={onSelectArtist} />
    </div>
  );
};

type EventDescriptionFormProps = {
  update?: boolean;
  event?: Event;
  eventName: string;
  onSubmit: (data: DescriptionInputs) => void;
};

export const EventDescriptionForm: React.FC<EventDescriptionFormProps> = ({ update = false, event, eventName, onSubmit }) => {
  const { register, handleSubmit: handleSubmit } = useForm<DescriptionInputs>({
    defaultValues: { eventDescription: event?.eventDescription ? event.eventDescription : undefined },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>{eventName}</h2>
      <FormLabel htmlFor="eventDescription">Event descripton</FormLabel>
      <Textarea placeholder="Event descripton" {...register("eventDescription", { required: true })} />
      <Input type="submit" title="submit" value={update ? "Update event" : "Save event"} />
    </form>
  );
};

export const FacebookForm: React.FC<{ onSearch: (data: FacebookInput) => void }> = ({ onSearch }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FacebookInput>();

  // TODO: add validation for facebook url patern
  // See /utilis.ts function isValidUrl
  // + clean url after /event/xxxxxx/

  return (
    <form onSubmit={handleSubmit(onSearch)}>
      <FormLabel htmlFor="facebookUrl">Facebook event url:</FormLabel>
      <Input placeholder="https://www.facebook.com/events/688042573307746/" {...register("facebookUrl")} />
      {errors.facebookUrl && errors.facebookUrl.type === "validate" && <>error</>}
      <Button type="submit" title="submit">
        Search
      </Button>
    </form>
  );
};

export type EventInputs = {
  id: string;
  version: number;
  name: string;
  imageUrl: string;
  facebookUrl: string;
  danceTypes: string[];
  eventTypes: string[];
  artists: string[];
  location?: OsmPlace;
  startDate: string;
  startHour: string;
  endDate: string;
  endHour: string;
  isFree: boolean;
  vendorUrl: string;
  websiteUrl: string;
  organizerEmail: string;
  eventDescription: string;
  usersId: string;
};

export type DescriptionInputs = {
  eventDescription: string;
};

export type FacebookInput = {
  facebookUrl: string;
};

const formatDate = (epoch: number): string => {
  const date = new Date(epoch);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`; //"YYYY-MM-DD"
};

const formatHour = (epoch: number): string => {
  const date = new Date(epoch);
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
};
