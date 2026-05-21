// Path: frontend/src/app/core/services/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

// Interceptor HTTP (pośrednik) odpowiedzialny za automatyczne dołączanie tokena JWT do nagłówków wychodzących żądań HTTP
export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  // Weryfikacja obecności tokenu; w przypadku jego istnienia żądanie jest klonowane z dodanym nagłówkiem Authorization Bearer
  if(token){
    req = req.clone({setHeaders: {Authorization: `Bearer ${token}`}});
  }
  return next(req);
};
