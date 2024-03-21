import { useAuth0 } from "@auth0/auth0-react";
import { Button, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { DescriptionInputs, EventDescriptionForm, EventFormDetails, EventInputs } from "../components/EventForms";
import { FileDrop } from "../components/FileDrop";
import { Event } from "../types/types";
import { serverUrl } from "../utils/server";

const CreateEvent = () => {
  const [eventData, setEventData] = useState<EventInputs | undefined>();
  const [formData, setFormData] = useState<FormData | undefined>(); // event cover image
  const [coverImage, setCoverImage] = useState<string | undefined>(); // cover image file
  const [previousEvent, setPreviousEvent] = useState<Event | undefined>();

  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
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
      setPreviousEvent(response.body);
    } catch (error) {
      console.error(error);
    }
  };

  const onNext: SubmitHandler<EventInputs> = (data) => {
    setEventData(data);
  };

  const onSubmit: SubmitHandler<DescriptionInputs> = async (data) => {
    const token = await getAccessTokenSilently();
    // 1 Send image to server
    let imageUrl = null;
    if (formData) {
      const rawImageResponse = await fetch(serverUrl + "/images", {
        method: "POST",
        headers: {
          // "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const imageResponse = await rawImageResponse.json();
      imageUrl = imageResponse.body.path;

      if (imageUrl == null) {
        // TODO CREATE ALERT
        return;
      }
    }
    // 2 Create or update event
    const newEvent = { ...eventData, eventDescription: data.eventDescription, ...(formData && imageUrl && { imageUrl: imageUrl }) };
    const rawResponse = await fetch(previousEvent ? serverUrl + "/events/" + eventID : serverUrl + "/events/new", {
      method: previousEvent ? "PUT" : "POST", // update : create
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newEvent),
    });
    const response = await rawResponse.json();

    if (response.body) {
      toast({
        description: previousEvent ? "Sucsessfully updated!" : "Sucsessfully created!",
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

  const getFormInfo = (form: FormData) => {
    setFormData(form);
  };

  return (
    <div>
      <Button onClick={() => navigate(-1)}>Back to previous page</Button>
      <h1>{previousEvent ? "Update event" : "Create an event"}</h1>
      <div>
        <FileDrop getFormInfo={getFormInfo} getCoverImage={setCoverImage} />
        {previousEvent?.imageUrl && <img alt="preview image" src={serverUrl + "/" + previousEvent?.imageUrl} />}
        {coverImage && <img alt="preview image" src={coverImage} />}
        {previousEvent && eventData == null && <EventFormDetails onNext={(data) => onNext(data)} event={previousEvent} />}
        {previousEvent == null && eventData == null && <EventFormDetails onNext={(data) => onNext(data)} />}
        {previousEvent && eventData != null && (
          <EventDescriptionForm eventName={eventData.name} onSubmit={(data) => onSubmit(data)} event={previousEvent} />
        )}
        {previousEvent == null && eventData != null && (
          <EventDescriptionForm eventName={eventData.name} onSubmit={(data) => onSubmit(data)} />
        )}
      </div>
    </div>
  );
};

export default CreateEvent;
