export type Event = {
  id: string;
  version: number;
  name: string;
  facebookUrl: string;
  danceTypes: string[];
  eventTypes: string[];
  artists: Artist[];
  location: string;
  startDate: string;
  endDate: string;
  isFree: boolean;
  vendorUrl: string;
  organizerEmail: string;
  eventDescription: string;
  usersId: string;
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
