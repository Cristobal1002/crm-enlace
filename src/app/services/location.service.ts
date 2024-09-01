import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { ConfigurationsService } from './configurations.service';


@Injectable({
  providedIn: 'root'
})
export class LocationService {
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

  getCountries():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/location/countries`, { headers: this.headers })
    .pipe(catchError(this.handleError));
  }

  getStatesByCountry(id:number):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/location/states/by-country?countryId=${id}`, { headers: this.headers })
    .pipe(catchError(this.handleError));
  }

  getCitiesByState(id:number):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/location/cities/by-state?stateId=${id}`, { headers: this.headers })
    .pipe(catchError(this.handleError));
  }

  getCitiesByCountry(id:number):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/location/cities/by-country?countryId=${id}`, { headers: this.headers })
    .pipe(catchError(this.handleError));
  }

  getStateByCity(id:number):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/location/states/by-city?stateId=${id}`, { headers: this.headers })
    .pipe(catchError(this.handleError));
  }

}
