import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { DescriptionInputs, EventDescriptionForm, EventFormDetails, EventInputs } from "../components/EventForms";
import { serverUrl } from "../utils/server";

const CreateEvent = () => {
  const [eventData, setEventData] = useState<EventInputs | null>();
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const onNext: SubmitHandler<EventInputs> = (data) => {
    setEventData(data);
  };

  const onSubmit: SubmitHandler<DescriptionInputs> = async (data) => {
    const token = await getAccessTokenSilently();
    await fetch(serverUrl + "/events/new", {
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
    navigate("/");
  };

  /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
  return (
    <div>
      <h1>Create an event</h1>
      <div>
        {eventData == null && <EventFormDetails onNext={(data) => onNext(data)} />}
        {eventData != null && <EventDescriptionForm eventName={eventData.name} onSubmit={(data) => onSubmit(data)} />}
      </div>
    </div>
  );
};

export default CreateEvent;
