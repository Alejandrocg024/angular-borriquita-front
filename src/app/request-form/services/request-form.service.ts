import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environment';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Answer, GetRequestFormsResponse, RequestForm } from '../interfaces/request-form.interface';

@Injectable({
  providedIn: 'root'
})
export class RequestFormService {
  private baseUrl: string = environments.baseUrl;


  constructor(private http: HttpClient) { }


  getRequestForm(): Observable<RequestForm[]> {
    return this.http.get<GetRequestFormsResponse>(`${this.baseUrl}/requestForm`)
      .pipe(
        map(response => response.requestForms),
        catchError(error => of([]))
      );
  }

  getRequestFormsById(id: string): Observable<RequestForm | undefined> {
    const token = localStorage.getItem('token');
    return this.http.get<RequestForm>(`${this.baseUrl}/requestForm/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }).pipe(
      catchError(error => of(undefined))
    );
  }

  create( rf: RequestForm ): Observable<RequestForm> {
    const token = localStorage.getItem('token');
    return this.http.post<RequestForm>(`${this.baseUrl}/requestForm`, rf , {
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

  createAnswer( answer: Answer ): Observable<RequestForm> {
    const token = localStorage.getItem('token');
    return this.http.post<RequestForm>(`${this.baseUrl}/requestForm/${answer.requestId}`, answer , {
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


}
