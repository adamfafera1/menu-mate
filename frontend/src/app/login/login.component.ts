import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RoleNavigationService } from '../services/role-navigation.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageService } from 'primeng/api';
import { ToastModule } from "primeng/toast";

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ButtonModule, FloatLabelModule, RouterLink, ToastModule],
  standalone: true,
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private messageService: MessageService,
    private roleNavigationService: RoleNavigationService
  ) {}

  ngOnInit(){
    this.showLoginRequest()
    this.showReviewRequest()
    this.showEditRequest()


    localStorage.removeItem('registerSuccess');
    localStorage.removeItem('reviewLoggedOut');
    localStorage.removeItem('editLoggedOut');
  }

  onLogin(email: string, password: string){
    this.authService.login(email,password).subscribe({
      next: res => {
        console.log('Login response:', res);
        this.authService.setToken(res.token);
        
        // Use role-based navigation instead of always going to browse
        setTimeout(() => {
          this.roleNavigationService.redirectToDefaultPage();
        }, 100); // Small delay to ensure token is processed
      },
      error: error => {
        console.error('Login failed', error);
          this.messageService.add({severity: 'error', summary: 'Wrong credentials', detail: 'Wrong credentials, please try again'});
      
      }
    })
  }

  showLoginRequest(){
    if(localStorage.getItem('registerSuccess')){
      setTimeout(()=> {
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Successfully registered, please login now'});
      },100)
    }
  }

  showReviewRequest(){
    if(localStorage.getItem('reviewLoggedOut')){
      setTimeout(()=> {
        this.messageService.add({severity: 'warn', summary: 'Failed', detail: 'Please log in to post a review'});
      },100)
    }
  }

  showEditRequest(){
    if(localStorage.getItem('editLoggedOut')){
      setTimeout(()=> {
        this.messageService.add({severity: 'warn', summary: 'Failed', detail: 'Please log in to propse an edit'});
      },100)
    }
  }

}
