import { loadStripe } from '@stripe/stripe-js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environment';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Pay } from '../interfaces/pay.interface';
import { GetPaysResponse } from '../interfaces/pays-response.interface';

@Injectable({
  providedIn: 'root'
})
export class PaysService {
  private baseUrl: string = environments.baseUrl;


  constructor(private http: HttpClient) { }


  getPays(): Observable<Pay[]> {
    return this.http.get<GetPaysResponse>(`${this.baseUrl}/pay?limit=100`)
      .pipe(
        map(response => response.pays),
        catchError(error => of([]))
      );
  }

  getPayById(id: string): Observable<Pay | undefined> {
    const token = localStorage.getItem('token');
    return this.http.get<Pay>(`${this.baseUrl}/pay/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }).pipe(
      catchError(error => of(undefined))
    );
  }

  deletePay(id: string): Observable<void> {
    const token = localStorage.getItem('token');
    return this.http.delete<void>(`${this.baseUrl}/pay/${id}`, {
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

  register(pay: Pay): Observable<Pay> {
    const token = localStorage.getItem('token');
    return this.http.post<Pay>(`${this.baseUrl}/pay`, pay, {
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

  update(pay: Pay) {
    const token = localStorage.getItem('token');
    if (!pay.id) throw Error('Se requiere un id para actualizar un pago');

    return this.http.put(`${this.baseUrl}/pay/${pay.id}`, pay, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }).pipe(
      map(async (res: any) => {
        const stripe = await loadStripe(environments.stripeAPIKey);
        const { id } = res;
        const result = await stripe?.redirectToCheckout({ sessionId: id });

        if (result?.error) {
          console.error(result.error.message);
          return;
        }
      })
    ).subscribe({
      error: (error) => console.error('Error:', error)
    });
  }

  payCard(confirmToken: string) {
    const token = localStorage.getItem('token');
    return this.http.get<Pay>(`${this.baseUrl}/pay/accept/${confirmToken}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }).pipe(
      catchError(error => of(undefined))
    );
  }


}
