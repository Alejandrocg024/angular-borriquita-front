import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces';
import { Role } from '../interfaces';

export const isMayGuard: CanActivateFn = (route, state) => {

  const authService = inject( AuthService );
  const router      = inject( Router );

  if ( authService.authStatus() === AuthStatus.authenticated ) {
    const user = authService.currentUser();
    if ( user?.role === Role.Admin || user?.role === Role.Mayord ) {
      return true;
    }
  }


  router.navigateByUrl('');
  return false;
};
