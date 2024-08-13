import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigurationsService } from './configurations.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PodiumService {
  private baseUrl: string;
  private headers: HttpHeaders;

  constructor(private config: ConfigurationsService, private http: HttpClient, private router: Router) {
    this.baseUrl = config.getApiUrl();
    this.headers = config.getHeaders();
  }

  getActiveCampaign(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/campaign/active`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  
  getCampaignList(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/campaign/list`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getCampaignListPag(page: number, pageSize: number, search?:string): Observable<any> {
    if (search){
      return this.http.get<any>(`${this.baseUrl}/campaign/list?name=${search}&page=${page}&pageSize=${pageSize}`,{ headers: this.headers });
    }else{
      return this.http.get<any>(`${this.baseUrl}/campaign/list?page=${page}&pageSize=${pageSize}`,{ headers: this.headers });
    }
  }

  createCampaign(campaign: { name: string, rhema: string, goal: number, phrase: string, status: boolean, created_by: number, updated_by: number }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/campaign`, campaign, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  inactivateCurrentCampaign(data: { status: boolean, updated_id: number }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/campaign/inactivate`, data, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  validateActiveOne(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/campaign/validate-active`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Ocurrió un error en la solicitud'));
  }

  updateCampaign(id:number, data:{}){
    return this.http.put(`${this.baseUrl}/campaign/${id}`, data, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  activateCampaign(data:{id:number, updated_by:number}){
    return this.http.put(`${this.baseUrl}/campaign/activate`, data, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  } 
}
