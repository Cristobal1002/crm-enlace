import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationsService {
  private apiUrl: string;
  private version = 'v1'
  constructor(private http:HttpClient) {
    this.apiUrl = environment.apiUrl;
   }
   getApiUrl(){
    return `${this.apiUrl}${this.version}`
   }
}
