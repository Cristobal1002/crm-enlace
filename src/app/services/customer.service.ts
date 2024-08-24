import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { ConfigurationsService } from './configurations.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

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

  createCustomer(customer: {
    document_type: string, document: number, company_name?: string,
    first_name?: string, last_name?: string, phone: string, email: string,
    birthday?: string, gender?: string, country_id: number, state_id: number, city_id: number,
    neighborhood: string, address: string, created_by: number, updated_by: number
  }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/customer`, customer, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getCustomerListPag(page: number, pageSize: number, search?: { [key: string]: string }): Observable<any> {
    let params: any = {
      page: page,
      pageSize: pageSize
    };
    // Si se proporciona un objeto de búsqueda, agrega sus propiedades a params
    if (search) {
      for (const key in search) {
        if (search.hasOwnProperty(key)) {
          params[key] = search[key];
        }
      }
    }

    // Realizar la solicitud HTTP con los parámetros y encabezados
    return this.http.get<any>(`${this.baseUrl}/customer/list`, {
      params: params,
      headers: this.headers
    });
  }


}
