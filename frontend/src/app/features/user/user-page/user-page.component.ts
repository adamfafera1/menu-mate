// Path: frontend/src/app/features/user/user-page/user-page.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterLink, Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { TabsModule } from 'primeng/tabs';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MediaService } from '../../../core/services/media.service';
import { RatingServiceService } from '../../../core/services/rating-service.service';
import { RatingItemService } from '../../../core/services/rating-item.service';
import { forkJoin } from 'rxjs';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [CommonModule, ButtonModule, AvatarModule, TabsModule, RouterLink, ConfirmDialogModule, FileUploadModule, ToastModule, RatingModule, FormsModule],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})

export class UserPageComponent implements OnInit {

  loading: boolean = true;
  user: any = null;
  userReviews: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public mediaService: MediaService,
    private ratingService: RatingServiceService,
    private ratingItemService: RatingItemService
  ) { }

  // Inicjalizacja komponentu - wywołanie pobierania profilu użytkownika
  ngOnInit() {
    this.loadCurrentUser();
  }

  // Weryfikacja tożsamości użytkownika oraz pobranie pełnych danych profilowych z bazy
  loadCurrentUser() {
    // Sprawdzenie stanu zalogowania
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Dekodowanie tożsamości z tokena JWT
    const userFromToken = this.authService.getUserFromToken();
    if (userFromToken && userFromToken.id) {
      // Pobranie danych profilowych z bazy na podstawie zdekodowanego ID
      this.authService.getUserById(userFromToken.id).subscribe(
        (user) => {
          this.user = user;
          // Pobranie wszystkich recenzji przypisanych do użytkownika
          this.loadUserReviews(user.id);
        },
        (error) => {
          console.error('Failed to fetch user data by ID', error);
          this.loading = false;
        }
      );
    } else {
      console.error('Failed to decode user ID from token');
      this.router.navigate(['/login']);
    }
  }

  // Pobranie historii wszystkich opinii (restauracji oraz dań) wystawionych przez użytkownika
  loadUserReviews(userId: string) {
    // Równoległe zapytania do dwóch różnych endpointów za pomocą operatora forkJoin
    forkJoin({
      restaurantReviews: this.ratingService.getReviewsByUserId(userId),
      itemReviews: this.ratingItemService.getReviewsByUserId(userId)
    }).subscribe({
      next: (results) => {
        // Dodanie tagów identyfikacyjnych typów opinii w celu poprawnego renderowania w widoku HTML
        const rReviews = results.restaurantReviews.map(r => ({ ...r, type: 'restaurant' }));
        const iReviews = results.itemReviews.map(i => ({ ...i, type: 'item' }));

        // Konsolidacja list w jedną wspólną kolekcję opinii użytkownika
        this.userReviews = [...rReviews, ...iReviews];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load user reviews', err);
        this.loading = false;
      }
    });
  }

  // Wyświetlenie okna dialogowego z potwierdzeniem chęci wylogowania się z aplikacji
  confirmLogout() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to sign out?',
      header: 'Sign Out',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () => {
        this.logout();
      }
    });
  }

  // Usunięcie tokena JWT z pamięci podręcznej i przekierowanie użytkownika na ekran logowania
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Obsługa przesyłania nowego zdjęcia profilowego użytkownika do chmury (Azure Blob Storage)
  onUpload(event: any) {
    // Weryfikacja obecności pliku w zdarzeniu wysyłki
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      // Przesłanie pliku do bazy chmurowej za pośrednictwem serwisu autoryzacyjnego
      this.authService.uploadProfileImage(file).subscribe({
        next: (response) => {
          // Dynamiczna aktualizacja ścieżki do obrazu w lokalnym obiekcie widoku
          this.user.imgPath = response.imgPath;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Profile picture updated successfully'
          });
        },
        error: (error) => {
          console.error('Upload failed:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update profile picture'
          });
        }
      });
    }
  }
}
