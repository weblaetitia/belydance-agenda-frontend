export type Event = {
  version: number;
  eventName: string;
  facebookUrl: string;
  eventType: [string];
  style: [string];
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
  eventDescription: string;
  usersId: string;
};
