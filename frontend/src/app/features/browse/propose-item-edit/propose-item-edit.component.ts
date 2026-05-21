// Path: frontend/src/app/features/browse/propose-item-edit/propose-item-edit.component.ts
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
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

// Enumerator definiujący modyfikowalne właściwości pozycji menu (dania)
export enum ItemProperty {
  Name = 'Name',
  Price = 'Price',
  Calories = 'Calories',
  Fats = 'Fats',
  Carbs = 'Carbs',
  Proteins = 'Proteins',
  Allergens = 'Allergens',
  Description = 'Description',
}

@Component({
  selector: 'app-propose-item-edit',
  standalone: true,
  imports: [
    SelectModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    DialogModule,
    ToastModule,
  ],
  templateUrl: './propose-item-edit.component.html',
  styleUrl: './propose-item-edit.component.css',
})
// Komponent formularza dialogowego służący do zgłaszania propozycji poprawek danych konkretnego produktu w menu
export class ProposeItemEditComponent implements OnInit, OnChanges {
  @Input() itemId: string | null = null;
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() editProposed = new EventEmitter<void>();

  properties = Object.values(ItemProperty);
  selectedProperty: ItemProperty | null = null;
  newValue: string = '';
  currentUser: any = null;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {}

  // Reakcja na zmianę widoczności okna dialogowego - pobranie danych uwierzytelnionego użytkownika
  ngOnChanges() {
    if (this.visible && !this.currentUser) {
      this.loadCurrentUser();
    }
  }

  // Weryfikacja tożsamości oraz pobranie z bazy danych pełnego profilu aktualnego użytkownika
  loadCurrentUser() {
    if (!this.authService.isAuthenticated()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Login Required',
        detail: 'Please log in to propose item edits',
      });
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
        detail: 'Please log in to propose item edits',
      });
      this.closeDialog();
      this.router.navigate(['/login']);
    }
  }

  // Przesłanie nowej propozycji modyfikacji właściwości dania do API
  proposeEdit() {
    if (!this.authService.isAuthenticated()) {
      localStorage.setItem('editLoggedOut', 'true');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.currentUser) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User data not loaded. Please try again.',
      });
      return;
    }

    if (!this.selectedProperty || !this.newValue || !this.itemId) {
      console.log('Validation failed:', {
        selectedProperty: this.selectedProperty,
        newValue: this.newValue,
        itemId: this.itemId,
      });
      return;
    }

    const edit = {
      ItemId: this.itemId,
      PropertyName: this.selectedProperty,
      NewValue: this.newValue,
    };

    console.log('Edit: ', edit);

    this.http.post(`${API_CONFIG.baseUrl}/EditItems`, edit).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Edit proposed successfully',
        });
        this.resetForm();
        this.editProposed.emit();
        this.closeDialog();
      },
      error: (error) => {
        console.error('Error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to propose edit',
        });
        console.log(edit);
      },
    });
  }

  // Przywrócenie pól formularza propozycji zmian do wartości domyślnych
  private resetForm() {
    this.selectedProperty = null;
    this.newValue = '';
  }

  // Zamknięcie okna dialogowego formularza propozycji poprawek
  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
