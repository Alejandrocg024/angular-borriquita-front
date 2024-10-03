export interface User {
  dni:            string;
  name:           string;
  lastname:       string;
  birthDate:      Date;
  email:          string;
  emailValidated: boolean;
  admissionDate:  Date;
  password:      string;
  outDate?:       null;
  address?:       string;
  role?:           Role;
  id:             string;
}

export enum Role {
  Admin = 'ADMIN_ROLE',
  Comm = 'COMUNICACIONES_ROLE',
  Mayord = 'MAYORDOMIA_ROLE',
}

