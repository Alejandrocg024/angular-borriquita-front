import { Pay } from "./pay.interface";

export interface GetPaysResponse {
  page:          number;
  limit:         number;
  total:         number;
  next:          string;
  prev:          string;
  pays: Pay[];
}
