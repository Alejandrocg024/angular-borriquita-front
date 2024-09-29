import { Injectable } from "@angular/core";
import { environments } from "../../../enviroments/enviroments";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { GetEventResponse, Event } from "../interfaces/event.interface";
import { EventInput } from '@fullcalendar/core';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private baseUrl: string = environments.baseUrl;


  constructor(private http: HttpClient) { }

  getEventById(id: string): Observable<Event | undefined> {
    const token = localStorage.getItem('token');
    return this.http.get<Event>(`${this.baseUrl}/event/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }).pipe(
      catchError(error => of(undefined))
    );
  }


  getEvents(): Observable<Event[]> {
    return this.http.get<GetEventResponse>(`${this.baseUrl}/event`)
      .pipe(
        map(response => response.events),
        map(announcements => announcements.sort((a, b) =>
          new Date(b.startDate).getTime() - new Date(a.endDate).getTime()
        )),
        catchError(error => of([]))
      );
  }

  getInitialEvents(): Observable<EventInput[]> {
    const events: EventInput[] = [];

    return this.getEvents().pipe(
      map(res => {
        for (const event of res) {
          if (event.allDay) {
            events.push({
              id: event.id,
              title: event.title,
              start: new Date(event.startDate).toISOString().replace(/T.*$/, ''),
            });
          } else {
            events.push({
              id: event.id,
              title: event.title,
              start: event.startDate,
              end: event.endDate,
            });
          }
        }
        return events;
      })
    );
  }

  updateEvent(event: Event): Observable<Event> {
    const token = localStorage.getItem('token');
    if (!event.id) throw Error('Se requiere un id para actualizar un anuncio');

    return this.http.put<Event>(`${this.baseUrl}/event/${event.id}`, event, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }).pipe(
      catchError(error => of(error))
    );
  }

  deleteEvent(id: string): Observable<boolean> {
    const token = localStorage.getItem('token');
    return this.http.delete<void>(`${this.baseUrl}/event/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }).pipe(
      map(resp => true),
      catchError(error => of(error))
    );
  }

  addEvent(event: Event): Observable<Event> {
    const token = localStorage.getItem('token');
    return this.http.post<Event>(`${this.baseUrl}/event`, event, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }).pipe(
      catchError(error => throwError(error))
    );
  }
}
