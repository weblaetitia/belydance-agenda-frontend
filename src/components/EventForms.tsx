import { useAuth0 } from "@auth0/auth0-react";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Artist, Event } from "../types/types";
import { serverUrl } from "../utils/server";

type EventFormDetailsProps = {
  event?: Event;
  onNext: (data: EventInputs) => void;
};

export const EventFormDetails: React.FC<EventFormDetailsProps> = ({ event, onNext }) => {
  const [artistSelected, setArtistSelected] = useState<Artist[] | null>();
  const [artistsFound, setArtistsFound] = useState<Artist[] | null>();
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

  if (event) return <>TODO</>;
  return (
    <div>
      <form onSubmit={handleNext(onSubmit)}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="name">Event name:</label>
          <input placeholder="Event name" {...register("name", { required: true })} />
          {errors.name && <span>This field is required</span>}

          <label htmlFor="facebookUrl">Facebook event URL:</label>
          <input placeholder="Facebook event url" {...register("facebookUrl")} />

          <label htmlFor="eventType">Event type:</label>
          <select id="eventType" multiple {...register("eventTypes")}>
            <option value="workshop">Workshop</option>
            <option value="festival">Festival</option>
            <option value="show">Show</option>
            <option value="hafla">Hafla</option>
            <option value="gathering">Gathering</option>
          </select>

          <label htmlFor="danceTypes">Choose a style:</label>
          <select id="danceTypes" multiple {...register("danceTypes")}>
            <option value="fusion">Fusion</option>
            <option value="fcbd">FCBD®</option>
            <option value="datura">Datura</option>
            <option value="its">ITS</option>
          </select>

          <div>
            <p>Artist</p>
            {artistSelected &&
              artistSelected.map((artist, i) => (
                <React.Fragment key={i}>
                  <div>
                    {artist.name} <span onClick={() => onRemoveArtist(artist)}>X</span>
                  </div>
                </React.Fragment>
              ))}

            <div>
              <label htmlFor="search Artist">Search Artist</label>
              <br />
              <input placeholder="Type artist name" onChange={(e) => searchArtist(e.target.value)} />{" "}
            </div>
            {artistsFound && (
              <ul>
                {artistsFound.map((artist, i) => (
                  <React.Fragment key={i}>
                    <li>
                      {artist.name} <button onClick={() => onSelectArtist(artist)}>Add</button>
                    </li>
                  </React.Fragment>
                ))}
              </ul>
            )}
          </div>

          <label htmlFor="location">Event location:</label>
          <input placeholder="location-id" {...register("location")} />

          <label htmlFor="startDate">When does your event start and end? *</label>
          <input type="date" id="startDate" {...register("startDate")} min="2023-03-01" />

          <input type="date" id="endtDate" {...register("endDate")} min="2023-03-01" />

          <p>Is your event free?</p>
          <div>
            <label htmlFor="isFree">yes it's free!</label>
            <input type="checkbox" id="isFree" {...register("isFree")} />
          </div>

          <p>Tickets vendor url</p>
          <input {...register("vendorUrl")} />

          <p>Organizer email</p>
          <input {...register("organizerEmail")} />

          <input type="submit" title="Next" value="Next" />
        </div>
      </form>
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

  if (event) return <>TODO</>;
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>{eventName}</h2>
      <textarea placeholder="Event descripton" {...register("eventDescription", { required: true })} />
      <input type="submit" title="submit" value="Save event" />
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
  organizerEmail: string;
  eventDescription: string;
  usersId: string;
};

export type DescriptionInputs = {
  eventDescription: string;
};
