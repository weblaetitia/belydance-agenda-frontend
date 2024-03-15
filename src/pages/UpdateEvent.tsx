import { useAuth0 } from "@auth0/auth0-react";
import { Button, Spinner, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { DescriptionInputs, EventDescriptionForm, EventFormDetails, EventInputs } from "../components/EventForms";
import { Event } from "../types/types";
import { serverUrl } from "../utils/server";

const UpdateEvent = () => {
  const [eventData, setEventData] = useState<EventInputs | null>();
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>();
  const { eventID } = useParams();
  const toast = useToast();

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

  const onNext: SubmitHandler<EventInputs> = (data) => {
    setEventData(data);
  };

  const onSubmit: SubmitHandler<DescriptionInputs> = async (data) => {
    const token = await getAccessTokenSilently();
    const rawResponse = await fetch(serverUrl + "/events/" + eventID, {
      method: "PUT",
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...eventData, eventDescription: data.eventDescription }),
    });
    const response = await rawResponse.json();
    if (response.body) {
      toast({
        description: "Sussesfully updated",
        isClosable: true,
        status: "success",
      });
      navigate("/");
    } else if (response.error) {
      toast({
        description: response.error,
        isClosable: true,
        status: "error",
      });
    }
  };

  if (event == null) return <Spinner />;
  return (
    <div>
      <Button onClick={() => navigate(-1)}>- Back</Button>
      <h1>Create an event</h1>
      <div>
        {eventData == null && <EventFormDetails onNext={(data) => onNext(data)} event={event} />}
        {eventData != null && <EventDescriptionForm eventName={eventData.name} onSubmit={(data) => onSubmit(data)} event={event} />}
      </div>
    </div>
  );
};

export default UpdateEvent;
