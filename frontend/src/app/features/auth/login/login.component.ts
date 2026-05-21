import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RoleNavigationService } from '../../../core/services/role-navigation.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageService } from 'primeng/api';
import { ToastModule } from "primeng/toast";
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ButtonModule, FloatLabelModule, RouterLink, ToastModule, InputTextModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

// frontend/src/app/features/auth/login/login.component.ts
// Komponent uwierzytelniania (logowania) użytkowników z mechanizmem dynamicznego przekierowania zależnego od ról
export class LoginComponent implements OnInit {

  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private roleNavigationService: RoleNavigationService
  ) { }

  // Inicjalizacja komponentu - weryfikacja i prezentacja odpowiednich toastów informacyjnych oraz czyszczenie flag z localStorage
  ngOnInit() {
    this.showLoginRequest()
    this.showReviewRequest()
    this.showEditRequest()

    localStorage.removeItem('registerSuccess');
    localStorage.removeItem('reviewLoggedOut');
    localStorage.removeItem('editLoggedOut');
  }

  // Obsługa żądania logowania - wysłanie poświadczeń do API, zapisanie tokena JWT i przekierowanie użytkownika na domyślną stronę roli
  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: res => {
        console.log('Login response:', res);
        this.authService.setToken(res.token);

        // Zastosowanie dynamicznej nawigacji opartej na przypisanej roli (z lekkim opóźnieniem na przetworzenie tokena)
        setTimeout(() => {
          this.roleNavigationService.redirectToDefaultPage();
        }, 100);
      },
      error: error => {
        console.error('Login failed', error);
        this.messageService.add({ severity: 'error', summary: 'Wrong credentials', detail: 'Wrong credentials, please try again' });
      }
    })
  }

  // Wyświetlenie komunikatu o konieczności zalogowania po pomyślnym ukończeniu procesu rejestracji
  showLoginRequest() {
    if (localStorage.getItem('registerSuccess')) {
      setTimeout(() => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully registered, please login now' });
      }, 100)
    }
  }

  // Wyświetlenie komunikatu ostrzegawczego, jeśli użytkownik został przekierowany z formularza dodawania opinii (brak sesji)
  showReviewRequest() {
    if (localStorage.getItem('reviewLoggedOut')) {
      setTimeout(() => {
        this.messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Please log in to post a review' });
      }, 100)
    }
  }

  // Wyświetlenie komunikatu ostrzegawczego, jeśli użytkownik został przekierowany z widoku zgłaszania poprawek (brak sesji)
  showEditRequest() {
    if (localStorage.getItem('editLoggedOut')) {
      setTimeout(() => {
        this.messageService.add({ severity: 'warn', summary: 'Failed', detail: 'Please log in to propose an edit' });
      }, 100)
    }
  }
}
