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
import { DropdownModule } from 'primeng/dropdown';
import { UserRole } from '../models/user-roles';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, FloatLabel, InputText, RouterLink, Toast, DropdownModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [MessageService]
})
export class RegisterComponent {

  selectedRole: UserRole = UserRole.USER;
  roleOptions = [
    { label: 'User', value: UserRole.USER },
    { label: 'Restaurant Owner', value: UserRole.RESTAURANT_OWNER },
    { label: 'Admin', value: UserRole.ADMIN }
  ];

  constructor(private authService: AuthService, private router: Router, private messageService: MessageService) {}

  onRegister(email: string, userName: string, password: string){
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
