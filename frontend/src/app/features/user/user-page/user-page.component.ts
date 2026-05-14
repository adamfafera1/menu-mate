import { Component, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [CommonModule, ButtonModule, AvatarModule, TabsModule, RouterLink, ConfirmDialogModule, FileUploadModule, ToastModule],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent {
  
  loading: boolean = true;
  user: any = null;
    
  constructor(
    private authService: AuthService, 
    private router: Router, 
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public mediaService: MediaService
  ) {}

  ngOnInit(){
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    const userFromToken = this.authService.getUserFromToken();
    if (userFromToken && userFromToken.id) {
      this.authService.getUserById(userFromToken.id).subscribe(
        (user) => {
          this.user = user;
          this.loading = false;
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

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onUpload(event: any) {
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      this.authService.uploadProfileImage(file).subscribe({
        next: (response) => {
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
