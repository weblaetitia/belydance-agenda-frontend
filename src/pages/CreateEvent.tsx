import { useAuth0 } from "@auth0/auth0-react";
import { Button, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  DescriptionInputs,
  EventDescriptionForm,
  EventFormDetails,
  EventInputs,
  FacebookForm,
  FacebookInput,
} from "../components/EventForms";
import { FileDrop } from "../components/FileDrop";
import { Event, FacebookEvent } from "../types/types";
import { serverUrl } from "../utils/server";

const CreateEvent = () => {
  const [eventData, setEventData] = useState<Event | undefined>();
  const [formData, setFormData] = useState<FormData | undefined>(); // event cover image
  const [coverImage, setCoverImage] = useState<string | undefined>(); // cover image file
  const [previousEvent, setPreviousEvent] = useState<Event | undefined>();
  const [facebookEvent, setFacebookEvent] = useState<FacebookEvent | undefined>();

  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const { eventID } = useParams();
  const toast = useToast();

  useEffect(() => {
    if (eventID != null) getEventDetail(eventID);
  }, [eventID]);

  useEffect(() => {
    if (facebookEvent != null) {
      const event = {
        name: facebookEvent.name,
        imageUrl: facebookEvent.photo.imageUri,
        facebookUrl: facebookEvent.url,
        danceTypes: [],
        eventTypes: [],
        artists: [],
        location: facebookEvent.location.city ? facebookEvent.location.city : "",
        startDate: facebookEvent.startTimestamp,
        endDate: facebookEvent.endTimestamp,
        isFree: false,
        vendorUrl: facebookEvent.ticketUrl,
        eventDescription: facebookEvent.description,
      };
      setPreviousEvent(event);
    }
  }, [facebookEvent]);

  const getEventDetail = async (id: string): Promise<void> => {
    const token = await getAccessTokenSilently();
    try {
      const rawResponse = await fetch(serverUrl + "/events/one/" + id, {
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
    const formated = formatDate(data);
    setEventData({ ...data, startDate: formated.startDateEpoch, endDate: formated.endDateEpoch, formatedDate: formated.formatedDate });
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
    const newEvent = {
      ...eventData,
      eventDescription: data.eventDescription,
      ...(formData && imageUrl && { imageUrl: serverUrl + "/" + imageUrl }),
    };
    const rawResponse = await fetch(eventID ? serverUrl + "/events/" + eventID : serverUrl + "/events/new", {
      method: eventID ? "PUT" : "POST", // update : create
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
        description: eventID ? "Sucsessfully updated!" : "Sucsessfully created!",
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

  const searchFacebook = async (data: FacebookInput): Promise<void> => {
    const token = await getAccessTokenSilently();
    try {
      const rawResponse = await fetch(
        serverUrl +
          "/events/facebook?" +
          new URLSearchParams({
            url: data.facebookUrl,
          }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await rawResponse.json();
      setFacebookEvent(response.body);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      {previousEvent && <Button onClick={() => navigate(-1)}>Back to previous page</Button>}
      <h1>{previousEvent ? "Update event" : "Create an event"}</h1>
      <div>
        {/* Facebook search */}
        <FacebookForm onSearch={searchFacebook} />
        <FileDrop getFormInfo={getFormInfo} getCoverImage={setCoverImage} />
        {previousEvent?.imageUrl && <img alt="preview image" src={previousEvent?.imageUrl} />}
        {coverImage && <img alt="preview image" src={coverImage} />}
        {previousEvent && eventData == null && <EventFormDetails onNext={(data) => onNext(data)} event={previousEvent} />}
        {previousEvent == null && eventData == null && <EventFormDetails onNext={(data) => onNext(data)} />}
        {previousEvent && eventData != null && (
          <EventDescriptionForm
            eventName={eventData.name}
            onSubmit={(data) => onSubmit(data)}
            event={previousEvent}
            update={eventID != null}
          />
        )}
        {previousEvent == null && eventData != null && (
          <EventDescriptionForm eventName={eventData.name} onSubmit={(data) => onSubmit(data)} update={eventID != null} />
        )}
      </div>
    </div>
  );
};

export default CreateEvent;

const formatDate = (
  data: EventInputs
): {
  startDateEpoch: number | undefined;
  endDateEpoch: number | undefined;
  formatedDate: string | undefined;
} => {
  let startDateString = undefined;
  if (data.startDate != "") startDateString = data.startDate;
  if (data.startHour != "") startDateString = startDateString + " " + data.startHour;
  let startDateEpoch = undefined;
  if (startDateString != undefined) {
    const startDate = new Date(startDateString);
    startDateEpoch = startDate.getTime();
  }

  let endDateString = undefined;
  if (data.endDate != "") endDateString = data.endDate;
  if (data.endHour != "") endDateString = endDateString + " " + data.endHour;
  let endDateEpoch = undefined;
  if (endDateString != undefined) {
    const endDate = new Date(endDateString);
    endDateEpoch = endDate.getTime();
  }

  let formatedDate = undefined;
  if (startDateString != undefined) formatedDate = startDateString;
  if (endDateString != undefined) formatedDate = formatedDate + " – " + endDateString;

  return {
    startDateEpoch,
    endDateEpoch,
    formatedDate,
  };
};
