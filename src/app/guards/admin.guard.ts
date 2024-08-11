import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';
import { map } from 'rxjs/operators';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  return authService.getCurrentUser().pipe(
    map(user => {
      if (user?.role === 'admin') {
        return true;
      } else {
        router.navigate(['/home']); // Redirigir si no tiene el rol adecuado
        return false;
      }
    })
  );
};
