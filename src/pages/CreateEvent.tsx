import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type EventInputs = {
  eventName: string;
  facebookUrl: string;
  eventType: string[];
  style: string[];
  artist: {
    artistName: string;
    artistFacebookUrl: string;
    artistIgUrl: string;
  };
  location: string;
  startDate: string;
  endDate: string;
  curency: string;
  isFree: boolean;
  eventPrice: number;
  eventCapacity: number;
  vendorUrl: string;
  organizerEmail: string;
};

type DescriptionInputs = {
  eventDescription: string;
};

const serveurUrl = import.meta.env.VITE_API_SERVER_URL;

const CreateEvent = () => {
  const [eventData, setEventData] = useState<EventInputs | null>();
  const { getAccessTokenSilently } = useAuth0();

  const {
    register,
    handleSubmit: handleNext,
    formState: { errors },
  } = useForm<EventInputs>({
    defaultValues: {
      eventName: "Stage with Rachel Redfern",
      facebookUrl: "https://www.facebook.com/events/804524284857588/?ref=newsfeed",
      eventType: ["workshop"],
      style: ["fusion", "fcbd"],
      artist: {
        artistName: "Rachel Redfern",
        artistFacebookUrl: "https://www.facebook.com/rachaelredfern",
        artistIgUrl: "https://www.instagram.com/rachael.redfern/",
      },
      location: "YrpGaehcX4Q6Eind7",
      startDate: "2023-03-01",
      // endDate: "2023-03-01",
      curency: "euro",
      isFree: true,
      eventPrice: 200,
      eventCapacity: 30,
      vendorUrl: "https://www.helloasso.com/associations/terpsichore-3/adhesions/fcbd-style-workshop-kristine-philippa",
      organizerEmail: "organizer@gmail.com",
    },
  });

  const { register: register2, handleSubmit: handleSubmit } = useForm<DescriptionInputs>();

  const onNext: SubmitHandler<EventInputs> = (data) => {
    setEventData(data);
  };

  const onSubmit: SubmitHandler<DescriptionInputs> = async (data) => {
    const token = await getAccessTokenSilently();
    const eventCreated = await fetch(serveurUrl + "/events/new", {
      method: "POST",
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...eventData, eventDescription: data.eventDescription }),
    });
    const jsonEvent = await eventCreated.json();
    console.log(jsonEvent.body);
  };

  /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
  return (
    <div>
      <h1>Create an event</h1>
      <div>
        {eventData == null && (
          <form onSubmit={handleNext(onNext)}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <input placeholder="Event name" {...register("eventName", { required: true })} />
              {errors.eventName && <span>This field is required</span>}

              <input placeholder="Facebook event url" {...register("facebookUrl")} />

              <label htmlFor="eventType">Event type:</label>
              <select id="eventType" multiple {...register("eventType")}>
                <option value="workshop">Workshop</option>
                <option value="festival">Festival</option>
                <option value="show">Show</option>
                <option value="hafla">Hafla</option>
                <option value="gathering">Gathering</option>
              </select>

              <label htmlFor="style">Choose a style:</label>
              <select id="style" multiple {...register("style")}>
                <option value="fusion">Fusion</option>
                <option value="fcbd">FCBD®</option>
                <option value="datura">Datura</option>
                <option value="its">ITS</option>
              </select>

              <div>
                <p>Artist</p>
                <div>
                  <label htmlFor="artist.artistName">Name:</label>
                  <input placeholder="Artist name" {...register("artist.artistName")} />
                </div>
                <div>
                  <label htmlFor="artist.artistFacebookUrl">Facebook page:</label>
                  <input placeholder="facebook" {...register("artist.artistFacebookUrl")} />
                </div>
                <div>
                  <label htmlFor="artist.artistIgUrl">Instagram page:</label>
                  <input placeholder="instagram" {...register("artist.artistIgUrl")} />
                </div>
              </div>

              <label htmlFor="location">Event location:</label>
              <input placeholder="location-id" {...register("location")} />

              <label htmlFor="startDate">When does your event start and end? *</label>
              <input type="date" id="startDate" {...register("startDate")} min="2023-03-01" />

              <input type="date" id="endtDate" {...register("endDate")} min="2023-03-01" />

              <p>How much do you want to charge for your event?</p>
              <div>
                <label htmlFor="isFree">Event is free</label>
                <input type="checkbox" id="isFree" {...register("isFree")} />
              </div>
              <div>
                <select id="curency" multiple {...register("curency")}>
                  <option value="euro">€</option>
                  <option value="dollar">$</option>
                  <option value="other">other</option>
                </select>
                <input defaultValue={100} type="number" {...(register("eventPrice"), { valueasnumber: "true" })} />
              </div>

              <p>What's the capacity for your event?</p>
              <input type="number" {...(register("eventCapacity"), { valueasnumer: "true" })} />

              <p>Tickets vendor url</p>
              <input {...register("vendorUrl")} />

              <p>Organizer email</p>
              <input {...register("organizerEmail")} />

              <input type="submit" title="Next" value="Next" />
            </div>
          </form>
        )}
        {eventData != null && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2>{eventData.eventName}</h2>
            <textarea placeholder="Event descripton" {...register2("eventDescription", { required: true })} />
            <input type="submit" title="submit" value="Save event" />
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateEvent;
