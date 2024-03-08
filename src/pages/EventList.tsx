import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { Event } from "../types/types";
const serveurUrl = import.meta.env.VITE_API_SERVER_URL;

const EventList = () => {
  const [events, setEvents] = useState<Event[] | null>();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getEventList();
  }, []);

  const getEventList = async () => {
    const token = await getAccessTokenSilently();
    try {
      const rawResponse = await fetch(serveurUrl + "/events/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await rawResponse.json();
      setEvents(response.body);
      console.log("events list", response.body);
    } catch (error) {
      console.error("une erreur");
      console.error(error);
    }
  };
  return (
    <div>
      <h1>Events list</h1>
      {events != null && (
        <ul>
          {events.map((event) => {
            return (
              <li>
                {event.eventName} – {event.startDate}
              </li>
            );
          })}
        </ul>
      )}
      {events == null && <p>No events listed.</p>}
    </div>
  );
};

export default EventList;
