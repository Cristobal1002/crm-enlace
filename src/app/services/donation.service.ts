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

  createDonation(donation: {campaign_id: number, petition:string, testimony?:string, 
    account_id:number, customer_id:number, user_id:number, quotes: number, amount: number, 
    total_amount:number, reasons:any[], novelties: any[]}){
    return this.http.post<any>(`${this.baseUrl}/donation`, donation, { headers: this.headers })
  }
}
