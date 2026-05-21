// Path: frontend/src/app/features/browse/review-restaurant-make/review-restaurant-make.component.ts
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { API_CONFIG } from '../../../core/config/api.config';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { TextareaModule } from 'primeng/textarea';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-review-restaurant-make',
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    DialogModule,
    RatingModule,
    FloatLabelModule,
    TextareaModule,
  ],
  templateUrl: './review-restaurant-make.component.html',
  styleUrl: './review-restaurant-make.component.css',
})
// Komponent formularza dialogowego do tworzenia i wysyłania nowych recenzji dla wybranej restauracji (lokalu)
export class ReviewRestaurantMakeComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  title: string = '';
  description: string = '';
  rating: number = 0;
  currentUser: any = null;

  constructor(
    public messageService: MessageService,
    public http: HttpClient,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
  ) { }

  // Reakcja na zmianę widoczności okna dialogowego - pobranie informacji o zalogowanym użytkowniku
  ngOnChanges() {
    if (this.visible && !this.currentUser) {
      this.loadCurrentUser();
    }
  }

  ngOnInit() { }

  // Weryfikacja sesji oraz pobranie z API pełnego obiektu profilu zalogowanego użytkownika na podstawie tożsamości z tokena JWT
  loadCurrentUser() {
    if (!this.authService.isAuthenticated()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Login Required',
        detail: 'Please log in to post a review',
      });
      localStorage.setItem('reviewLoggedOut', 'true');
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
        detail: 'Please log in to post a review',
      });
      this.closeDialog();
      this.router.navigate(['/login']);
    }
  }

  // Wysłanie nowo utworzonej opinii o lokalu gastronomicznym (restauracji) do API
  postReview() {
    // Weryfikacja sesji użytkownika przed przesłaniem opinii
    if (!this.authService.isAuthenticated()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Login Required',
        detail: 'Please log in to post a review',
      });
      this.closeDialog();
      this.router.navigate(['/login']);
      return;
    }

    // Weryfikacja, czy dane profilowe aktualnego użytkownika zostały załadowane z serwera
    if (!this.currentUser) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User data not loaded. Please try again.',
      });
      return;
    }

    // Pobranie identyfikatora restauracji z parametrów aktywnej trasy
    const restaurantId = this.route.snapshot.paramMap.get('id');

    // Przygotowanie obiektu DTO z danymi recenzji i danymi autora
    const review = {
      restaurantId: restaurantId,
      userId: this.currentUser.id,
      userName: this.currentUser.userName,
      userImagePath:
        this.currentUser.imagePath ||
        'https://innostudio.de/fileuploader/images/default-avatar.png',
      title: this.title,
      description: this.description,
      rating: this.rating,
    };

    // Wysłanie zapytania HTTP POST z nową opinii do bazy danych za pośrednictwem serwisu API
    this.http.post(`${API_CONFIG.baseUrl}/Reviews`, review).subscribe({
      next: (response) => {
        console.log('Review posted successfully ', response);
        // Prezentacja komunikatu o powodzeniu dodania opinii
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Review posted',
        });
        // Zamknięcie formularza dialogowego i czyszczenie jego stanu
        this.closeDialog();
        this.resetForm();
      },
      error: (error) => {
        // Rejestrowanie wyjątku w konsoli i prezentacja komunikatu o błędzie sieciowym
        console.error('Error posting review', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to post review',
        });
      },
    });
  }

  // Zamknięcie okna dialogowego formularza dodawania opinii restauracji
  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  // Przywrócenie domyślnych (pustych) wartości pól formularza recenzji lokalu
  resetForm() {
    this.title = '';
    this.description = '';
    this.rating = 0;
  }
}
