import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { ConfigurationsService } from './configurations.service';
import { jwtDecode } from 'jwt-decode';



@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private baseUrl: string;
  private currentUser = new BehaviorSubject<any>(null);

  constructor(private config: ConfigurationsService, private http: HttpClient, private router: Router) {
    this.baseUrl = config.getApiUrl();
    const token = localStorage.getItem('token');
    if (token) {
      this.decodeToken(token);
    }
  }

  login(credentials: { user: string; password: string; }) {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          let token = response.data.token;
          console.log('response.data en el servicio:', token)
          localStorage.setItem('token', token);
          this.decodeToken(token);

        }),
        catchError(error => {
          console.error('Login error', error);
          return of(null); // Manejo de errores
        })
      );
  }

  decodeToken(token: string) {
    try {
      const decoded = jwtDecode<any>(token);
      this.currentUser.next(decoded);
      console.log('current user',this.currentUser)
      console.log('Decode:', decoded)
    } catch (error) {
      console.error('Error decoding token', error);
      this.currentUser.next(null);
    }
  }

  validateToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';
    return this.http.get<any>(`${this.baseUrl}/auth/validate`, {
      headers: {
        'x-app-token': token
      }
    }).pipe(
      tap(response => {
        console.log('Token validado:', response);
      }),
      map(response => {
        return true;  // Retorna true si la validación es exitosa
      }),
      catchError(error => {
        console.error('Error al validar el token', error);
        return of(false); // Retorna false en caso de error
      })
    );
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  getCurrentUser() {
    return this.currentUser.asObservable();  
  }

  hasRole(role: string) {
    const user = this.currentUser.value;
    return user && user.role === role;
  }

  getUserData(){
    const {role} = this.currentUser.value
    role === 'admin' ? this.currentUser.value.displayRole = 'Administrador' : this.currentUser.value.displayRole = 'Agente'
    return this.currentUser.value
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.next(null);
    this.router.navigate(['/login']); // Redirigir a la página de login
  }
}
