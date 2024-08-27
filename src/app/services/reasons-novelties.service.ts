import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { ConfigurationsService } from './configurations.service';

@Injectable({
  providedIn: 'root'
})
export class ReasonsNoveltiesService {
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

  createReason(reason: { name: string, status: boolean, created_by: number, updated_by: number }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reason`, reason, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateReason(id:number, data:{}){
    return this.http.put(`${this.baseUrl}/reason/${id}`, data, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  getReasonListPag(page: number, pageSize: number, search?:string): Observable<any> {
    if (search){
      return this.http.get<any>(`${this.baseUrl}/reason/list?name=${search}&page=${page}&pageSize=${pageSize}`,{ headers: this.headers });
    }else{
      return this.http.get<any>(`${this.baseUrl}/reason/list?page=${page}&pageSize=${pageSize}`,{ headers: this.headers });
    }
  }

  createNovelty(novelty: { name: string, status: boolean, created_by: number, updated_by: number }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/novelty`, novelty, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateNovelty(id:number, data:{}){
    return this.http.put(`${this.baseUrl}/novelty/${id}`, data, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  getNoveltyListPag(page: number, pageSize: number, search?:string): Observable<any> {
    if (search){
      return this.http.get<any>(`${this.baseUrl}/novelty/list?name=${search}&page=${page}&pageSize=${pageSize}`,{ headers: this.headers });
    }else{
      return this.http.get<any>(`${this.baseUrl}/novelty/list?page=${page}&pageSize=${pageSize}`,{ headers: this.headers });
    }
  }

}
