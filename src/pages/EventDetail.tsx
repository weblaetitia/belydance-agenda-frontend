import { useAuth0 } from "@auth0/auth0-react";
import { Button, Image, Link } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LocationMap from "../components/LocationMap";
import { Event } from "../types/types";
import { serverUrl } from "../utils/server";

const EventDetail: React.FC = () => {
  const [event, setEvent] = useState<Event | null>();
  const { eventID } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (eventID != null) getEventDetail(eventID);
  }, [eventID]);

  const getEventDetail = async (id: string): Promise<void> => {
    const token = await getAccessTokenSilently();
    try {
      const rawResponse = await fetch(serverUrl + "/events/one/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await rawResponse.json();
      setEvent(response.body);
    } catch (error) {
      // TODO Error handler
      console.error(error);
    }
  };

  const deleteEvent = async (id: string): Promise<void> => {
    const token = await getAccessTokenSilently();
    try {
      const rawResponse = await fetch(serverUrl + "/events/" + id, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await rawResponse.json();
      if (response.message) {
        console.log(response.message); // TODO toast
        navigate("/events/list");
      } else {
        console.log(response.error); // TODO toast
      }
    } catch (error) {
      // TODO Error handler
      console.error(error);
    }
  };

  if (event == null || eventID == null) return <>No event found</>;

  return (
    <div>
      <h1>{event.name}</h1>
      <Image boxSize="100%" objectFit="cover" src={serverUrl + "/" + event.imageUrl} alt={event.name} />
      <ul>
        <li>{event.formatedDate}</li>
        <li>Artists</li>
        <li>
          <ul>
            {event.artists.map((el, i) => (
              <li key={i}>{el.name}</li>
            ))}
          </ul>
        </li>
        <li>
          {event.eventTypes.map((type, i) => (
            <span key={i}>{type} - </span>
          ))}
        </li>
        <li>
          {event.danceTypes.map((style, i) => (
            <span key={i}>{style} - </span>
          ))}
        </li>
        {event.isFree ? <li>Free event</li> : null}

        <li>{event.eventDescription}</li>
        <li>{event.facebookUrl}</li>
        {event.location && (
          <li>
            <p>
              {event.location.name} ({event.location.address.postcode}) - {event.location.address.country}
            </p>
            <LocationMap position={{ lat: Number(event.location.lat), lng: Number(event.location.lon) }} zoom={6} />
          </li>
        )}
        <li>{event.organizerEmail}</li>
        <li>{event.vendorUrl}</li>
      </ul>
      <Link onClick={() => navigate("/events/update/" + eventID)}>Update Event</Link>
      <Button onClick={() => deleteEvent(eventID)}>Delete Event</Button>
    </div>
  );
};

export default EventDetail;
