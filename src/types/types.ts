export type Event = {
  id?: string;
  version?: number;
  name: string;
  imageUrl: string;
  facebookUrl: string;
  danceTypes: string[];
  eventTypes: string[];
  artists: Artist[];
  location: string;
  startDate: string;
  endDate?: string;
  isFree: boolean;
  vendorUrl?: string;
  websiteUrl?: string;
  organizerEmail?: string;
  eventDescription: string;
  usersId?: string;
};

export type Artist = {
  id: string;
  name: string;
  urls: {
    instagramUrl?: string;
    facebookUrl?: string;
    websiteUrl?: string;
    youtubeUrl?: string;
  };
  location: {
    city?: string;
    country?: string;
  };
};

export type FacebookEvent = {
  id: string; // id in url
  name: string;
  description: string;
  location: {
    id: string;
    name: string;
    description?: string;
    url?: string;
    coordinates: {
      latitude: 48.357270730507;
      longitude: 10.89127084553;
    };
    countryCode: string; // TODO country code
    type: string;
    address?: string;
    city?: string;
  };
  photo: {
    url: string;
    id: number;
    imageUri: string; // This
  };
  video?: string;
  isOnline: false;
  url: string; // facebbok event url
  startTimestamp: 1720420200;
  endTimestamp: 1720965600;
  formattedDate: string;
  timezone: string; // TODO timezone type
  onlineDetails?: null; // TODO mustbe object
  hosts: [
    {
      id: string;
      name: string;
      url: string;
      type: string; // TODO type ("User" | ...)
      photo: null; // TODO
    }
  ];
  ticketUrl?: string;
  usersResponded: 20;
};
