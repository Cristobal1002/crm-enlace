import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { ConfigurationsService } from './configurations.service';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private baseUrl: string;
  private headers: HttpHeaders;

  constructor(private config: ConfigurationsService, private http: HttpClient, private router: Router) {
    this.baseUrl = config.getApiUrl();
    this.headers = config.getHeaders();
  }

  createBank(bank: {
    name: string, account_number: string,
    additional_data?: string, pay_link?: string, status: boolean
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/bank`, bank, { headers: this.headers })
      .pipe(map((response: any) => {
        return { data: response, error: null };
      }),
        catchError((error) => {
          let errorMsg = 'Ocurrió un error en la solicitud';
          if (error.status === 400 && error.error && error.error.error) {
            errorMsg = error.error.error; // Mensaje de error desde el backend
          }
          return of({ data: null, error: errorMsg });
        })
      )
  }

  getBankListPag(page: number, pageSize: number, search?: { [key: string]: string }): Observable<any> {
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
    return this.http.get(`${this.baseUrl}/bank/list`, {
      params: params,
      headers: this.headers
    });
  }
  

  updateBank(id: number, data: {}): Observable<any> {
    return this.http.put(`${this.baseUrl}/bank/${id}`, data, { headers: this.headers }).pipe(
      map((response: any) => {
        // Aquí puedes retornar la respuesta si la solicitud es exitosa
        return { data: response, error: null };
      }),
      catchError((error) => {
        // Manejo de errores para que no rompa la ejecución
        let errorMsg = 'Ocurrió un error en la solicitud';
        if (error.status === 400 && error.error && error.error.error) {
          errorMsg = error.error.error; // Mensaje de error desde el backend
        }
        return of({ data: null, error: errorMsg });
      })
    );
  }

  getActiveBank(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/bank/list/active`, { headers: this.headers })
  }


}
