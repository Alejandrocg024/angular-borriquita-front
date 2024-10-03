import { User } from "../../auth/interfaces";

export interface GetUsersResponse {
  page:          number;
  limit:         number;
  total:         number;
  next:          string;
  prev:          string;
  users: User[];
}
