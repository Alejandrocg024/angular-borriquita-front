
export interface GetRequestFormsResponse {
  page:          number;
  limit:         number;
  total:         number;
  next:          string;
  prev:          string;
  requestForms: RequestForm[];
}

export interface RequestForm {
  id: string;
  type: Type;
  date: Date;
  details: string;
  email?: string;
  answers?: Answer[];
}

export interface Answer {
  requestId: string;
  user: string;
  date: Date;
  details: string;
}

export enum Type {
  Baja = 'BAJA',
  Asignacion = 'ASIGNACIÓN',
  Consulta = 'CONSULTA',
  Otros = 'OTROS'
}
