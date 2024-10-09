import { User } from "../../auth/interfaces";

export interface GetAnnouncementResponse {
  page:          number;
  limit:         number;
  total:         number;
  next:          string;
  prev:          string;
  announcements: Announcement[];
}

export interface Announcement {
  id:               string;
  title:            string;
  publicationDate:  Date;
  modificationDate: Date;
  available:        boolean;
  author:           User;
  body:             string;
  media?:            string;
}

