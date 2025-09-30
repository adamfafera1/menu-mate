import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export enum RestaurantProperty {
  Name = 'Name',
  Description = 'Description',
  Location = 'Location',
  Phone = 'Phone',
}

@Component({
  selector: 'app-propose-restaurant-edit',
  standalone: true,
  imports: [DropdownModule, InputTextModule, ButtonModule, FormsModule, DialogModule],
  templateUrl: './propose-restaurant-edit.component.html',
  styleUrl: './propose-restaurant-edit.component.css'
})
export class ProposeRestaurantEditComponent implements OnInit, OnChanges {
  @Input() restaurantId: string | null = null;
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() editProposed = new EventEmitter<void>();

  properties = Object.values(RestaurantProperty);
  selectedProperty: RestaurantProperty | null = null;
  newValue: string = '';
  currentUser: any = null;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.visible && !this.currentUser) {
      this.loadCurrentUser();
    }
  }

  loadCurrentUser() {
    if (!this.authService.isAuthenticated()) {
      this.messageService.add({severity:'warn', summary: "Login Required", detail:"Please log in to propose restaurant edits"});
      localStorage.setItem('editLoggedOut', 'true')
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
          this.messageService.add({severity:'error', summary: "Error", detail:"Failed to load user data"});
        }
      );
    } else {
      console.error('Failed to decode user ID from token');
      this.messageService.add({severity:'warn', summary: "Login Required", detail:"Please log in to propose restaurant edits"});
      this.closeDialog();
      this.router.navigate(['/login']);
    }
  }

  proposeEdit() {
    if (!this.authService.isAuthenticated()) {
      this.messageService.add({severity:'warn', summary: "Login Required", detail:"Please log in to propose restaurant edits"});
      this.closeDialog();
      this.router.navigate(['/login']);
      return;
    }

    if (!this.currentUser) {
      this.messageService.add({severity:'error', summary: "Error", detail:"User data not loaded. Please try again."});
      return;
    }

    if (!this.selectedProperty || !this.newValue || !this.restaurantId) return;

    const edit = {
      restaurantId: this.restaurantId,
      propertyName: this.selectedProperty,
      newValue: this.newValue
    };

    this.http.post(`https://localhost:7084/api/EditRestaurants`, edit)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Edit proposed successfully'
          });
          this.resetForm();
          this.editProposed.emit();
          this.closeDialog();
        },
        error: (error) => {
          console.error('Error:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to propose edit'
          });
        }
      });
  }

  private resetForm() {
    this.selectedProperty = null;
    this.newValue = '';
  }

  closeDialog(){
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

}
