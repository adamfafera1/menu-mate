import { Component, OnInit} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterLink, Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { TabsModule } from 'primeng/tabs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [ButtonModule, AvatarModule, TabsModule, RouterLink],
  providers: [AuthService],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent {
  
  loading: boolean = true;
  user: any = null;
    
  constructor(private authService: AuthService, private router: Router) {}

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

  logout(){
    this.authService.logout();
  }

}
