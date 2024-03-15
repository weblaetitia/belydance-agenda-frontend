import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Event } from "../types/types";
import { serverUrl } from "../utils/server";

const EventDetail = () => {
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
      const rawResponse = await fetch(serverUrl + "/events/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await rawResponse.json();
      setEvent(response.body);
    } catch (error) {
      console.error("une erreur");
      console.error(error);
    }
  };

  if (event == null || eventID == null) return <>No event found</>;

  return (
    <div>
      <h1>{event.name}</h1>
      <ul>
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

        <li>
          {event.startDate} – {event.endDate}
        </li>
        <li>{event.eventDescription}</li>
        <li>{event.facebookUrl}</li>
        <li>{event.location}</li>
        <li>{event.organizerEmail}</li>
        <li>{event.vendorUrl}</li>
      </ul>
      <Link onClick={() => navigate("/events/update/" + eventID)}>Update Event</Link>
    </div>
  );
};

export default EventDetail;
