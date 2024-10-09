import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environment';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { User } from '../../auth/interfaces';
import { GetUsersResponse } from '../interfaces/users-response.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl: string = environments.baseUrl;


  constructor(private http: HttpClient) { }


  getUsers(): Observable<User[]> {
    return this.http.get<GetUsersResponse>(`${this.baseUrl}/user?limit=100`)
      .pipe(
        map(response => response.users),
        catchError(error => of([]))
      );
  }

  getSuggestions( query: string ): Observable<User[]> {
    return this.http.get<GetUsersResponse>(`${ this.baseUrl }/user?q=${ query }&_limit=6`)
      .pipe(
        map(response => response.users),
        catchError(error => of([]))
      );
  }

  getUserById(id: string): Observable<User | undefined> {
    const token = localStorage.getItem('token');
    return this.http.get<User>(`${this.baseUrl}/user/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }).pipe(
      catchError(error => of(undefined))
    );
  }

  updateUser(user: User): Observable<User> {
    const token = localStorage.getItem('token');
    if (!user.id) throw Error('Se requiere un id para actualizar un usuario');

    return this.http.put<User>(`${this.baseUrl}/user/update/${user.dni}`, user, {
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

  deleteUser(id: string): Observable<void> {
    const token = localStorage.getItem('token');
    return this.http.delete<void>(`${this.baseUrl}/user/delete/${id}`, {
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
