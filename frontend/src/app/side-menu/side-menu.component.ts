import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { RatingServiceService } from '../services/rating-service.service';
import { AuthService } from '../services/auth.service';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-side-menu',
  imports: [MenuModule, AvatarModule, ConfirmDialog, ButtonModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent implements OnInit{

  items : MenuItem[] | undefined;
  options : MenuItem[] | undefined;
  reviewCount : number | null = 0;
  private id: string | null = null;
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);


  constructor(private router: Router, private ratingService: RatingServiceService, private authService: AuthService ) {
      this.id = this.router.url.split('/')[2] || null;
  }

  ngOnInit(){

    
    if(this.id) {
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
                {label: 'Home', icon:'pi pi-home', command: () => this.navigateHome()},
                {label: 'Edits', icon:'pi pi-file-edit', command: () => this.navigateEdits()},
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
                {label: 'Item edits', icon:'pi pi-file-edit', command : () => {this.navigateItemEdits()}},
                {label:'Item reviews', icon:'pi pi-star', command : () => {this.navigateItemReviews()}}, 
              ]
            },
            {
              label: 'Create',
              items: [
                {label: 'Add item', icon: 'pi pi-plus', command: () => {this.navigateAddItem()}}
              ]
            },
            {
              label: 'Self manage',
              items: [
                {label: 'Update Restaurant', icon:'pi pi-pencil', command: () => {this.navigateRestaurantSelfManage()}},
                {label: 'Update Items', icon:'pi pi-file-edit', command:() => {this.navigateItemsSelfManage()}}
              ]
            },
            {
              label: 'Options',
              items: [
                { label:'Sign out', icon:'pi pi-sign-out', command : () => {
                  // this.signOut()
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

  navigateHome(){
    this.router.navigate([`dashboard/${this.id}`]);
  }
  
  navigateEdits(){
    this.router.navigate([`dashboard/${this.id}/edits`]);
  }
  
  navigateReviews(){
    this.router.navigate([`dashboard/${this.id}/reviews`]);
  }
  
  navigateItemEdits(){
    this.router.navigate([`dashboard/${this.id}/item-edits`]);
  }
  
  navigateItemReviews(){
    this.router.navigate([`dashboard/${this.id}/item-reviews`]);
  }

  navigateAddItem(){
    this.router.navigate([`dashboard/${this.id}/add-item`]);
  }

  navigateRestaurantSelfManage(){
    this.router.navigate([`dashboard/${this.id}/restaurant-self-manage`])
  }  

  navigateItemsSelfManage(){
    this.router.navigate([`dashboard/${this.id}/items-self-manage`])
  }

  signOut() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

   confirm2(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Do you want to delete this record?',
            header: 'Danger Zone',
            icon: 'pi pi-info-circle',
            rejectLabel: 'Cancel',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Delete',
                severity: 'danger'
            },
        
            accept: () => {
                this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            }
        });
    }
}
