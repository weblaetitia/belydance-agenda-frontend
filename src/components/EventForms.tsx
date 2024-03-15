import { useAuth0 } from "@auth0/auth0-react";
import { Button, Checkbox, FormLabel, HStack, Input, Text, Textarea } from "@chakra-ui/react";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Artist, Event } from "../types/types";
import { serverUrl } from "../utils/server";
import ArtistModal from "./ArtistModal";

type EventFormDetailsProps = {
  event?: Event;
  onNext: (data: EventInputs) => void;
};

export const EventFormDetails: React.FC<EventFormDetailsProps> = ({ event, onNext }) => {
  const [artistSelected, setArtistSelected] = useState<Artist[] | undefined>(event ? event.artists : undefined);
  const [artistsFound, setArtistsFound] = useState<Artist[] | null>();
  const [artistModalOpen, setArtistModalOpen] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const {
    register,
    handleSubmit: handleNext,
    formState: { errors },
  } = useForm<EventInputs>({
    defaultValues: {
      name: event ? event.name : undefined,
      facebookUrl: event?.facebookUrl ? event?.facebookUrl : undefined,
      eventTypes: event?.eventTypes ? event.eventTypes : undefined,
      danceTypes: event?.danceTypes ? event.danceTypes : undefined,
      artists: undefined, // TODO
      location: event?.location ? event.location : undefined,
      startDate: event?.startDate ? event.startDate : undefined,
      endDate: event?.endDate ? event.endDate : undefined,
      isFree: event?.isFree ? event.isFree : undefined,
      vendorUrl: event?.vendorUrl ? event.vendorUrl : undefined,
      organizerEmail: event?.organizerEmail ? event.organizerEmail : undefined,
    },
  });

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
      onNext({ ...data, artists: artistIds });
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
          {/* FACEBOOK */}
          <FormLabel htmlFor="facebookUrl">Facebook event URL:</FormLabel>
          <Input placeholder="Facebook event url" {...register("facebookUrl")} />
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
          {/* LOCATION */}
          <FormLabel htmlFor="location">Event location:</FormLabel>
          <Input placeholder="location-id" {...register("location")} />
          {/* DATE */}
          <FormLabel htmlFor="startDate">When does your event start and end? *</FormLabel>
          <Input type="date" id="startDate" {...register("startDate")} min="2023-03-01" />
          <Input type="date" id="endtDate" {...register("endDate")} min="2023-03-01" />
          {/* FREE */}
          <FormLabel htmlFor="isFree">Is your event free?</FormLabel>
          <Checkbox {...register("isFree")}>Free</Checkbox>
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
  event?: Event;
  eventName: string;
  onSubmit: (data: DescriptionInputs) => void;
};

export const EventDescriptionForm: React.FC<EventDescriptionFormProps> = ({ event, eventName, onSubmit }) => {
  const { register, handleSubmit: handleSubmit } = useForm<DescriptionInputs>({
    defaultValues: { eventDescription: event?.eventDescription ? event.eventDescription : undefined },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>{eventName}</h2>
      <FormLabel htmlFor="eventDescription">Event descripton</FormLabel>
      <Textarea placeholder="Event descripton" {...register("eventDescription", { required: true })} />
      <Input type="submit" title="submit" value={event ? "Update event" : "Save event"} />
    </form>
  );
};

export type EventInputs = {
  id: string;
  version: number;
  name: string;
  facebookUrl: string;
  danceTypes: string[];
  eventTypes: string[];
  artists: string[];
  location: string;
  startDate: string;
  endDate: string;
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
