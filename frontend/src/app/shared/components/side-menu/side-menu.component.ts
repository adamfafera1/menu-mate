// Path: frontend/src/app/shared/components/side-menu/side-menu.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, ConfirmationService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RatingServiceService } from '../../../core/services/rating-service.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-side-menu',
  imports: [MenuModule, AvatarModule, ConfirmDialogModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent implements OnInit {

  items: MenuItem[] | undefined;
  options: MenuItem[] | undefined;
  reviewCount: number | null = 0;
  private id: string | null = null;

  // Wyodrębnienie identyfikatora restauracji z bieżącego segmentu ścieżki URL w konstruktorze
  constructor(private router: Router, private ratingService: RatingServiceService, private authService: AuthService, private confirmationService: ConfirmationService) {
    this.id = this.router.url.split('/')[2] || null;
  }

  // Inicjalizacja komponentu - pobranie statystyk opinii oraz zdefiniowanie struktury nawigacji
  ngOnInit() {
    // Weryfikacja obecności identyfikatora restauracji
    if (this.id) {
      // Pobranie z API liczby opinii przypisanych do lokalu w celu prezentacji w menu
      this.ratingService.countRestaurantReviews(this.id).subscribe({
        next: (count) => {
          this.reviewCount = count;
          // Inicjalizacja struktury zakładek i nawigacji w panelu bocznym
          this.items = [
            {
              separator: true
            },
            {
              label: 'Restaurant',
              items: [
                { label: 'Home', icon: 'pi pi-home', command: () => this.navigateHome() },
                { label: 'Edits', icon: 'pi pi-file-edit', command: () => this.navigateEdits() },
                {
                  label: 'Reviews',
                  icon: 'pi pi-star',
                  command: () => this.navigateReviews()
                },
              ]
            },
            {
              label: 'Menu',
              items: [
                { label: 'Item edits', icon: 'pi pi-file-edit', command: () => { this.navigateItemEdits() } },
                { label: 'Item reviews', icon: 'pi pi-star', command: () => { this.navigateItemReviews() } },
              ]
            },
            {
              label: 'Create',
              items: [
                { label: 'Add item', icon: 'pi pi-plus', command: () => { this.navigateAddItem() } }
              ]
            },
            {
              label: 'Self manage',
              items: [
                { label: 'Update Restaurant', icon: 'pi pi-pencil', command: () => { this.navigateRestaurantSelfManage() } },
                { label: 'Update Items', icon: 'pi pi-file-edit', command: () => { this.navigateItemsSelfManage() } }
              ]
            },
            {
              label: 'Options',
              items: [
                {
                  label: 'Sign out', icon: 'pi pi-sign-out', command: () => {
                    this.confirmSignOut();
                  }
                }
              ]
            }
          ];
        },
        error: (error) => {
          console.error('Error getting review count:', error);
          this.reviewCount = 0;
        }
      });
    }
  }


  // Przykładowe funkcja przekierowania do odpowiednich widoków w panelu administratora
  // Przekierowanie do głównego pulpitu (home) wybranej restauracji
  navigateHome() {
    this.router.navigate([`dashboard/${this.id}`]);
  }

  // Przekierowanie do listy poprawek (edits) zgłoszonych do restauracji
  navigateEdits() {
    this.router.navigate([`dashboard/${this.id}/edits`]);
  }

  // Przekierowanie do listy opinii o restauracji
  navigateReviews() {
    this.router.navigate([`dashboard/${this.id}/reviews`]);
  }

  // Przekierowanie do listy zgłoszonych poprawek dań z menu
  navigateItemEdits() {
    this.router.navigate([`dashboard/${this.id}/item-edits`]);
  }

  // Przekierowanie do listy opinii dotyczących konkretnych dań z menu
  navigateItemReviews() {
    this.router.navigate([`dashboard/${this.id}/item-reviews`]);
  }

  // Przekierowanie do formularza dodawania nowego dania do menu
  navigateAddItem() {
    this.router.navigate([`dashboard/${this.id}/add-item`]);
  }

  // Przekierowanie do formularza edycji profilu/właściwości samej restauracji
  navigateRestaurantSelfManage() {
    this.router.navigate([`dashboard/${this.id}/restaurant-self-manage`])
  }

  // Przekierowanie do panelu zarządzania i aktualizacji dań z menu
  navigateItemsSelfManage() {
    this.router.navigate([`dashboard/${this.id}/items-self-manage`])
  }

  // Wyświetlenie modalnego okna potwierdzenia chęci wylogowania administratora lokalu
  confirmSignOut() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to sign out?',
      header: 'Sign Out',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () => {
        this.signOut();
      }
    });
  }

  // Wyczyszczenie sesji i przekierowanie z powrotem na ekran logowania
  signOut() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
