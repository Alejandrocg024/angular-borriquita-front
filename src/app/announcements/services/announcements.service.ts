import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environments } from '../../../enviroments/enviroments';
import { Announcement, GetAnnouncementResponse } from '../interfaces/announcement.interface';
import { catchError, filter, firstValueFrom, map, Observable, of, throwError } from 'rxjs';
import { UploadResponse } from '../interfaces/upload-response.interface';

@Injectable({ providedIn: 'root' })
export class AnnouncementsService {
  private baseUrl: string = environments.baseUrl;


  constructor(private http: HttpClient) { }


  getAnnouncements(): Observable<Announcement[]> {
    return this.http.get<GetAnnouncementResponse>(`${this.baseUrl}/announcement`)
      .pipe(
        map(response => response.announcements),
        map(announcements => announcements.sort((a, b) =>
          new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime()
        )),
        catchError(error => of([]))
      );
  }

  getHomeAnnouncements(): Observable<Announcement[]> {
    return this.http.get<GetAnnouncementResponse>(`${this.baseUrl}/announcement?limit=100`)
      .pipe(
        map(response => response.announcements),
        map(announcements => announcements.sort((a, b) =>
          new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime()
        ),
      ), map(announcement => announcement.filter(announcement => announcement.available)),
      map(announcements => announcements.slice(0, 3)),
        catchError(error => of([]))
      );
  }

  getAnnouncementById(id: string): Observable<Announcement | undefined> {
    const token = localStorage.getItem('token');
    return this.http.get<Announcement>(`${this.baseUrl}/announcement/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }).pipe(
      catchError(error => of(undefined))
    );
  }

  addAnnouncement(announcement: Announcement): Observable<Announcement> {
    const token = localStorage.getItem('token');
    return this.http.post<Announcement>(`${this.baseUrl}/announcement`, announcement, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }).pipe(
      catchError(error => {
        const errorMessage = error.error.error || 'Error desconocido';
        return throwError(errorMessage);
      })
    );
  }

  updateAnnouncement(announcement: Announcement): Observable<Announcement> {
    const token = localStorage.getItem('token');
    if (!announcement.id) throw Error('Se requiere un id para actualizar un anuncio');

    return this.http.put<Announcement>(`${this.baseUrl}/announcement/${announcement.id}`, announcement, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }).pipe(
      catchError(error => {
        const errorMessage = error.error.error || 'Error desconocido';
        return throwError(errorMessage);
      })
    );
  }

  deleteAnnouncement(id: string): Observable<boolean> {
    const token = localStorage.getItem('token');
    return this.http.delete<void>(`${this.baseUrl}/announcement/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }).pipe(
      map(resp => true),
      catchError(error => of(error))
    );
  }

  uploadImage(file: File): Observable<UploadResponse> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const token = localStorage.getItem('token');

    return this.http.post<UploadResponse>(`${this.baseUrl}/upload`, formData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }).pipe(
      catchError(error => of(error))
    );
  }

  async uploadImageAsPromise(file: File): Promise<UploadResponse> {
    const observable = this.uploadImage(file);
    const response = await firstValueFrom(observable);
    return response;
  }

}
