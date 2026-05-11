import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from "primeng/floatlabel";
import { InputText } from "primeng/inputtext";
import { RouterLink } from '@angular/router';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SelectButtonModule } from 'primeng/selectbutton';
import { UserRole } from '../models/user-roles';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, FloatLabel, InputText, RouterLink, Toast, SelectButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [MessageService]
})
export class RegisterComponent {

  selectedRole: UserRole = UserRole.USER;
  passwordFocused: boolean = false;
  roleOptions = [
    { label: 'User', value: UserRole.USER },
    { label: 'Restaurant Owner', value: UserRole.RESTAURANT_OWNER }
  ];

  constructor(private authService: AuthService, private router: Router, private messageService: MessageService) {}

  get nameFieldLabel(): string {
    return this.selectedRole === UserRole.RESTAURANT_OWNER ? 'Restaurant Name' : 'Username';
  }

  // Password requirement validators
  hasMinLength(password: string): boolean {
    return password.length >= 8;
  }

  hasUpperCase(password: string): boolean {
    return /[A-Z]/.test(password);
  }

  hasNumber(password: string): boolean {
    return /[0-9]/.test(password);
  }

  hasSpecialChar(password: string): boolean {
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  }

  isPasswordValid(password: string): boolean {
    return this.hasMinLength(password) && this.hasUpperCase(password) && this.hasNumber(password) && this.hasSpecialChar(password);
  }

  onRegister(email: string, userName: string, password: string){
    // Validation checks
    if (!email || !userName || !password) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'All fields are required'});
      return;
    }
    console.log('Registering with role:', this.selectedRole);
    this.authService.register(email, userName, password, this.selectedRole).subscribe({
      next: (response) => {
        console.log('Registration response:', response);
        
        if (response && response.restaurantId) {
          this.authService.setRestaurantId(response.restaurantId);
          console.log('Restaurant created with ID:', response.restaurantId);
        }
        
        localStorage.setItem('registerSuccess', 'true');
        console.log('Registered user: Email: ', email," Username: ", userName, " Role: ", this.selectedRole);
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Registration successful! Please login.'});
        this.router.navigate(['/login']);
      },
      error: error => {
        console.error('Registration failed', error);
        console.error('Failed registration data:', { email, userName, role: this.selectedRole });
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Failed to register user, try again'})
      }
    })
  }

}
