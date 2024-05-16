import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const accessToken = authService.getJWTToken();
  if (accessToken) {
    var cloned = req.clone({
      setHeaders: {
        Authorization: `JWT ${accessToken}`,
      },
    });
    return next(cloned);
  }
  return next(req);
};
