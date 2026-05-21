// frontend/src/app/features/browse/propose-restaurant-edit/propose-restaurant-edit.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { API_CONFIG } from '../../../core/config/api.config';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

// Enumerator definiujący modyfikowalne właściwości profilu restauracji (lokalu)
export enum RestaurantProperty {
  Name = 'Name',
  Description = 'Description',
  Location = 'Location',
  Phone = 'Phone',
}

@Component({
  selector: 'app-propose-restaurant-edit',
  standalone: true,
  imports: [
    SelectModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    DialogModule,
  ],
  templateUrl: './propose-restaurant-edit.component.html',
  styleUrl: './propose-restaurant-edit.component.css',
})
// Komponent formularza dialogowego do zgłaszania propozycji poprawek danych profilowych restauracji
export class ProposeRestaurantEditComponent implements OnInit, OnChanges {
  @Input() restaurantId: string | null = null;
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() editProposed = new EventEmitter<void>();

  properties = Object.values(RestaurantProperty);
  selectedProperty: RestaurantProperty | null = null;
  newValue: string = '';
  currentUser: any = null;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() { }

  // Reakcja na zmianę widoczności okna dialogowego - pobranie profilu zalogowanego użytkownika
  ngOnChanges() {
    if (this.visible && !this.currentUser) {
      this.loadCurrentUser();
    }
  }

  // Uwierzytelnienie sesji oraz pobranie pełnych danych profilowych aktualnie zalogowanego użytkownika z API
  loadCurrentUser() {
    if (!this.authService.isAuthenticated()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Login Required',
        detail: 'Please log in to propose restaurant edits',
      });
      localStorage.setItem('editLoggedOut', 'true');
      this.closeDialog();
      this.router.navigate(['/login']);
      return;
    }

    const userFromToken = this.authService.getUserFromToken();
    if (userFromToken && userFromToken.id) {
      this.authService.getUserById(userFromToken.id).subscribe(
        (user) => {
          this.currentUser = user;
        },
        (error) => {
          console.error('Failed to fetch user data by ID', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load user data',
          });
        },
      );
    } else {
      console.error('Failed to decode user ID from token');
      this.messageService.add({
        severity: 'warn',
        summary: 'Login Required',
        detail: 'Please log in to propose restaurant edits',
      });
      this.closeDialog();
      this.router.navigate(['/login']);
    }
  }

  // Przesłanie nowej propozycji edycji danej właściwości lokalu gastronomicznego do API
  proposeEdit() {
    // Weryfikacja sesji użytkownika przed zgłoszeniem poprawek
    if (!this.authService.isAuthenticated()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Login Required',
        detail: 'Please log in to propose restaurant edits',
      });
      this.closeDialog();
      this.router.navigate(['/login']);
      return;
    }

    // Weryfikacja, czy dane aktualnego użytkownika zostały załadowane z serwera
    if (!this.currentUser) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User data not loaded. Please try again.',
      });
      return;
    }

    // Walidacja obecności wymaganych parametrów propozycji edycji
    if (!this.selectedProperty || !this.newValue || !this.restaurantId) return;

    // Przygotowanie obiektu DTO z danymi sugerowanej poprawki
    const edit = {
      restaurantId: this.restaurantId,
      propertyName: this.selectedProperty,
      newValue: this.newValue,
    };

    // Wysłanie propozycji zmiany danych restauracji na serwer API
    this.http.post(`${API_CONFIG.baseUrl}/EditRestaurants`, edit).subscribe({
      next: () => {
        // Prezentacja powiadomienia o pomyślnym zgłoszeniu edycji
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Edit proposed successfully',
        });
        // Czyszczenie pól formularza, emisja zdarzenia do komponentu nadrzędnego i zamknięcie dialogu
        this.resetForm();
        this.editProposed.emit();
        this.closeDialog();
      },
      error: (error) => {
        // Logowanie wyjątku w konsoli i wyświetlenie informacji o błędzie zapisu
        console.error('Error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to propose edit',
        });
      },
    });
  }

  // Przywrócenie wartości pól formularza propozycji edycji restauracji do stanu domyślnego
  private resetForm() {
    this.selectedProperty = null;
    this.newValue = '';
  }

  // Zamknięcie okna dialogowego formularza propozycji edycji lokalu
  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
