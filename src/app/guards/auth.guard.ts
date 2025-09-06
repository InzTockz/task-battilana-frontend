import { inject, Inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const authGuard: CanActivateFn = (route, state) => {

  const session = inject(LoginService);
  const router = inject(Router);

  if(session.getToken('userToken') != null && session.isTokenExpired()!=true){
    return true
  } else {
    return router.createUrlTree(['/login'])
  
  }
};
