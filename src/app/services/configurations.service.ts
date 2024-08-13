import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationsService {
  private apiUrl: string;
  private version = 'v1';

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  getApiUrl(): string {
    return `${this.apiUrl}${this.version}`;
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Función para armar los encabezados
  getHeaders(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (token) {
      headers = headers.set('x-app-token', token);
    }

    return headers;
  }
}
