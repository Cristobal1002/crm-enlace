import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { ConfigurationsService } from './configurations.service';

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  private baseUrl: string;
  private headers: HttpHeaders;

  constructor(private config: ConfigurationsService, private http: HttpClient, private router: Router) {
    this.baseUrl = config.getApiUrl();
    this.headers = config.getHeaders();
   }

   private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Ocurrió un error en la solicitud'));
  }

  getCustomerByDocument(document: string){
    return this.http.get<any>(`${this.baseUrl}/customer?document=${document}`, {
      headers: this.headers
    });
  }
}
