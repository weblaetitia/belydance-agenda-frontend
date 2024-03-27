import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EventExtract } from "../types/types";
import { serverUrl } from "../utils/server";

const EventList = () => {
  const [events, setEvents] = useState<EventExtract[] | null>();
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    getEventList();
  }, []);

  const getEventList = async () => {
    const token = await getAccessTokenSilently();
    try {
      const rawResponse = await fetch(serverUrl + "/events/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await rawResponse.json();
      setEvents(response.body);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Events list</h1>
      {events != null && (
        <ul>
          {events.map((event, i) => {
            return (
              <li key={i} onClick={() => navigate("/events/" + event.id)}>
                <a>{event.name}</a> - {new Date(event.startDate).toLocaleDateString()}
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
