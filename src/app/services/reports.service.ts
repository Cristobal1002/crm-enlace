import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { ConfigurationsService } from './configurations.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private baseUrl: string;
  private headers: HttpHeaders;

  constructor(private http: HttpClient, private config: ConfigurationsService, private router: Router) {
    this.baseUrl = config.getApiUrl();
    this.headers = config.getHeaders();
  }

  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Ocurrió un error en la solicitud'));
  }

  getTotalAmountByDayOfWeek(user: {user_id:number, role:string}): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reports/total-amount-by-day`, user, { headers: this.headers })
  }
  getTotalRecordsByDayOfWeek(user: {user_id:number, role:string}): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reports/total-records-by-day`, user, { headers: this.headers })
  }

  getTotalRecordsAndAmount(user: {user_id:number, role:string}): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reports//total-records-amount`, user, { headers: this.headers })
  }
}
