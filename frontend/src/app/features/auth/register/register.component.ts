// frontend/src/app/features/auth/register/register.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from "primeng/floatlabel";
import { InputText } from "primeng/inputtext";
import { RouterLink } from '@angular/router';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SelectButtonModule } from 'primeng/selectbutton';
import { UserRole } from '../../../core/models/user-roles';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, FloatLabel, InputText, RouterLink, Toast, SelectButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
// Komponent formularza rejestracji nowych kont użytkowników z obsługą walidacji bezpieczeństwa haseł oraz wyboru roli
export class RegisterComponent {

  // Aktualnie wybrana rola dla nowego konta (domyślnie Rola standardowego użytkownika)
  selectedRole: UserRole = UserRole.USER;
  // Flaga informująca, czy pole tekstowe hasła jest aktywne (skupione), służąca do wyświetlania dynamicznych kryteriów walidacji
  passwordFocused: boolean = false;
  // Definicje ról dostępnych do wyboru w formularzu
  roleOptions = [
    { label: 'User', value: UserRole.USER },
    { label: 'Restaurant Owner', value: UserRole.RESTAURANT_OWNER }
  ];

  constructor(private authService: AuthService, private router: Router, private messageService: MessageService) { }

  // Dynamiczna etykieta pola nazwy, dopasowywana do wybranej roli (np. nazwa restauracji dla właściciela)
  get nameFieldLabel(): string {
    return this.selectedRole === UserRole.RESTAURANT_OWNER ? 'Restaurant Name' : 'Username';
  }

  // Weryfikacja kryterium minimalnej długości hasła (co najmniej 8 znaków)
  hasMinLength(password: string): boolean {
    return password.length >= 8;
  }

  // Weryfikacja obecności co najmniej jednej wielkiej litery w haśle
  hasUpperCase(password: string): boolean {
    return /[A-Z]/.test(password);
  }

  // Weryfikacja obecności co najmniej jednej cyfry w haśle
  hasNumber(password: string): boolean {
    return /[0-9]/.test(password);
  }

  // Weryfikacja obecności co najmniej jednego znaku specjalnego w haśle
  hasSpecialChar(password: string): boolean {
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  }

  // Zagregowana walidacja sprawdzająca, czy wpisane hasło spełnia wszystkie wymogi polityki bezpieczeństwa
  isPasswordValid(password: string): boolean {
    return this.hasMinLength(password) && this.hasUpperCase(password) && this.hasNumber(password) && this.hasSpecialChar(password);
  }

  // Obsługa zdarzenia wysłania formularza rejestracji do bazy danych za pośrednictwem serwisu autoryzacyjnego
  onRegister(email: string, userName: string, password: string) {
    // Weryfikacja obecności wszystkich kluczowych danych w polach wejściowych
    if (!email || !userName || !password) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'All fields are required' });
      return;
    }
    console.log('Registering with role:', this.selectedRole);
    this.authService.register(email, userName, password, this.selectedRole).subscribe({
      next: (response) => {
        console.log('Registration response:', response);

        // Zapisanie wygenerowanego identyfikatora restauracji, jeżeli rejestracja dotyczyła właściciela lokalu
        if (response && response.restaurantId) {
          this.authService.setRestaurantId(response.restaurantId);
          console.log('Restaurant created with ID:', response.restaurantId);
        }
        // Przekierowanie do ekranu logowania po poprawnym utworzeniu konta
        localStorage.setItem('registerSuccess', 'true');
        console.log('Registered user: Email: ', email, " Username: ", userName, " Role: ", this.selectedRole);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registration successful! Please login.' });
        this.router.navigate(['/login']);
      },
      // Obsługa błędów wystąpionych podczas rejestracji, w tym komunikatów o duplikatach e-mail
      error: error => {
        console.error('Registration failed', error);
        console.error('Failed registration data:', { email, userName, role: this.selectedRole });
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to register user, try again' })
      }
    })
  }
}
