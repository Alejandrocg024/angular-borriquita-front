import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError, filter } from 'rxjs';

import { environments } from '../../../environments/environment';
import { AuthStatus, CheckTokenResponse, LoginResponse, User } from '../interfaces';
import { PaysService } from '../../profile/services/pays.service';
import { Pay, PayState } from '../../profile/interfaces/pay.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environments.baseUrl;
  private http = inject( HttpClient );

  private _currentUser = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>( AuthStatus.checking );

  //! Al mundo exterior
  public currentUser = computed( () => this._currentUser() );
  public authStatus = computed( () => this._authStatus() );


  constructor() {
    this.checkAuthStatus().subscribe();
  }

  private setAuthentication(user: User, token:string): boolean {
    this._currentUser.set( user );
    this._authStatus.set( AuthStatus.authenticated );

    localStorage.setItem('token', token);

    return true;
  }

  register( user: User ): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/user/register`, user )
    .pipe(
      catchError(error => {
        const errorMessage = error.error.error || 'Error desconocido';
        return throwError(errorMessage);
      })
    );
  }


  login( dni: string, password: string ): Observable<boolean> {

    const url  = `${ this.baseUrl }/user/login`;
    const body = { dni, password };

    return this.http.post<LoginResponse>( url, body )
      .pipe(
        map( ({ user, token }) => this.setAuthentication( user, token )),
        catchError(error => {
          const errorMessage = error.error.error || 'Error desconocido';
          return throwError(errorMessage);
        })
      );
  }

  checkAuthStatus():Observable<boolean> {

    const url   = `${ this.baseUrl }/user/check-token`;
    const token = localStorage.getItem('token');

    if ( !token ) {
      this.logout();
      return of(false);
    }


    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${ token }`);


      return this.http.get<CheckTokenResponse>(url, { headers })
      .pipe(
        map(({ user, token }) => this.setAuthentication(user, token)),
        catchError( error => {
          if ( error.status === 401 ) {
            this.logout();
          }
          return of(false);
          })
        );


  }

  logout() {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set( AuthStatus.notAuthenticated );

  }


}
