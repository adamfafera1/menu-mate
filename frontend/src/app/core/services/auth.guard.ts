// Path: frontend/src/app/core/services/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

// Strażnik tras (Route Guard) zabezpieczający punkty dostępowe wymagające uwierzytelnienia przed nieautoryzowanym wejściem
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  // Weryfikacja, czy użytkownik jest zalogowany; w przypadku braku sesji następuje przekierowanie na stronę logowania
  if(!authService.isAuthenticated()){
    window.location.href = '/login';
    return false;
  }
  return true;
};
