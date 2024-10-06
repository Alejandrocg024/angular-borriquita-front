import { User } from "../../auth/interfaces";

export interface Pay {
        id: string,
        user: string,
        concept: string,
        quantity: number,
        startDate: Date,
        finishDate: Date,
        state: PayState,
        payMethod?: PayMethod,
}

export interface PayUser {
  id: string,
  user: User,
  concept: string,
  quantity: number,
  startDate: Date,
  finishDate: Date,
  state: PayState,
  payMethod?: PayMethod,
}


export enum PayState {
  Pending = 'PENDING',
  Paid = 'PAID',
  Cancelled = 'CANCELLED',
}

export enum PayMethod {
  Cash = 'CASH',
  Card = 'CARD',
}
