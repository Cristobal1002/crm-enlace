import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  console.log('paso por el guard');
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  return authService.validateToken().pipe(
    map(isValid => {
      if (isValid) {
        return true;
      } else {
        // Redirigir al login con un query param `sessionExpired`
        router.navigate(['/login'], { queryParams: { sessionExpired: true } });
        return false;
      }
    }),
    catchError(error => {
      console.error('Error en el guard:', error);
      router.navigate(['/login'], { queryParams: { sessionExpired: true } }); // Redirigir al login en caso de error
      return of(false);
    })
  );
};
