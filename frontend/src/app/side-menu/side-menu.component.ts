import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, ConfirmationService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RatingServiceService } from '../services/rating-service.service';
import { AuthService } from '../services/auth.service';


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


  constructor(private router: Router, private ratingService: RatingServiceService, private authService: AuthService, private confirmationService: ConfirmationService) {
    this.id = this.router.url.split('/')[2] || null;
  }

  ngOnInit() {


    if (this.id) {
      this.ratingService.countRestaurantReviews(this.id).subscribe({
        next: (count) => {
          this.reviewCount = count;
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

  navigateHome() {
    this.router.navigate([`dashboard/${this.id}`]);
  }

  navigateEdits() {
    this.router.navigate([`dashboard/${this.id}/edits`]);
  }

  navigateReviews() {
    this.router.navigate([`dashboard/${this.id}/reviews`]);
  }

  navigateItemEdits() {
    this.router.navigate([`dashboard/${this.id}/item-edits`]);
  }

  navigateItemReviews() {
    this.router.navigate([`dashboard/${this.id}/item-reviews`]);
  }

  navigateAddItem() {
    this.router.navigate([`dashboard/${this.id}/add-item`]);
  }

  navigateRestaurantSelfManage() {
    this.router.navigate([`dashboard/${this.id}/restaurant-self-manage`])
  }

  navigateItemsSelfManage() {
    this.router.navigate([`dashboard/${this.id}/items-self-manage`])
  }

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

  signOut() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

}
