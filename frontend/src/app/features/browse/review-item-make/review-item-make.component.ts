import { Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { RatingModule } from 'primeng/rating';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { API_CONFIG } from '../../../core/config/api.config';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-review-item-make',
  imports: [
    DialogModule,
    RatingModule,
    FloatLabelModule,
    ButtonModule,
    FormsModule,
    TextareaModule,
  ],
  templateUrl: './review-item-make.component.html',
  styleUrl: './review-item-make.component.css',
})
// Komponent formularza dialogowego służący do wystawiania nowej oceny i opinii dla wybranego dania (produktu)
export class ReviewItemMakeComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() itemId: string | null = null;
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
  ) {}

  ngOnInit() {}

  // Reakcja na zmianę widoczności okna dialogowego - pobranie profilu zalogowanego użytkownika
  ngOnChanges() {
    if (this.visible && !this.currentUser) {
      this.loadCurrentUser();
    }
  }

  // Weryfikacja tożsamości oraz pobranie z bazy danych pełnego profilu aktualnego użytkownika na podstawie tokena JWT
  loadCurrentUser() {
    if (!this.authService.isAuthenticated()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Login Required',
        detail: 'Please log in to review items',
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
        detail: 'Please log in to review items',
      });
      this.closeDialog();
      this.router.navigate(['/login']);
    }
  }

  // Przesłanie nowej opinii i oceny produktu (dania) do bazy danych za pośrednictwem API
  postReview() {
    if (!this.authService.isAuthenticated()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Login Required',
        detail: 'Please log in to review items',
      });
      this.closeDialog();
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

    const review = {
      itemId: this.itemId,
      userId: this.currentUser.id,
      userName: this.currentUser.userName,
      userImagePath:
        this.currentUser.imagePath ||
        'https://innostudio.de/fileuploader/images/default-avatar.png',
      title: this.title,
      description: this.description,
      rating: this.rating,
    };

    this.http.post(`${API_CONFIG.baseUrl}/ReviewItems`, review).subscribe({
      next: (response) => {
        console.log('Review posted successfully ', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Review posted',
        });
        this.closeDialog();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error posting review', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to post review',
        });
      },
    });
  }

  // Zamknięcie okna dialogowego formularza dodawania opinii
  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  // Przywrócenie domyślnych wartości pól formularza dodawania recenzji produktu
  resetForm() {
    this.title = '';
    this.description = '';
    this.rating = 0;
  }
}
