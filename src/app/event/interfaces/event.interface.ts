
export interface GetEventResponse {
  page:          number;
  limit:         number;
  total:         number;
  next:          string;
  prev:          string;
  events: Event[];
}

export interface Event {
  id:               string;
  title:            string;
  startDate:        Date;
  endDate:          Date;
  allDay:          boolean;
  description:      string;
  location?:         string;
}


