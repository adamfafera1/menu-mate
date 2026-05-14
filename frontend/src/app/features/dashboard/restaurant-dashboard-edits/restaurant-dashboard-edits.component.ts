import { Component, OnInit } from '@angular/core';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.component';
import { MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { EditService } from '../../../core/services/edit.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { RestaurantService } from '../../../core/services/restaurant.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-restaurant-dashboard-edits',
  standalone: true,
  imports: [
    SideMenuComponent,
    SelectModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    ToastModule,
    FormsModule,
    CardModule,
    DatePipe,
  ],
  templateUrl: './restaurant-dashboard-edits.component.html',
  styleUrl: './restaurant-dashboard-edits.component.css',
})
export class RestaurantDashboardEditsComponent implements OnInit {
  pendingEdits: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private editService: EditService,
    private messageService: MessageService,
    private restaurantService: RestaurantService,
  ) {}
  restaurantUrl: any = null;
  restaurant: any = null;

  ngOnInit(): void {
    this.restaurantUrl = this.route.snapshot.paramMap.get('id');
    this.loadPendingEdits(this.restaurantUrl);
    this.loadRestaurant(this.restaurantUrl);
    this.restaurantService.getRestaurantById(this.restaurantUrl);
  }

  loadPendingEdits(restaurantId: string) {
    this.editService.getPendingRestaurantEdits(restaurantId).subscribe({
      next: (edits) => (this.pendingEdits = edits),
      error: (error) => console.error('Error loading edits: ', error),
    });
  }

  loadRestaurant(restaurantId: string) {
    this.restaurantService.getRestaurantById(restaurantId).subscribe({
      next: (restaurant) => (this.restaurant = restaurant),
      error: (error) => console.error('Error loading restaurant info', error),
    });
  }

  approveEdit(editId: string) {
    this.editService.approveRestaurantEdit(editId).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Edit approved and applied to restaurant',
        });
        this.loadPendingEdits(this.restaurantUrl);
      },
      error: (error) => {
        console.error('Error approving edit:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to approve edit',
        });
      },
    });
  }

  denyEdit(editId: string) {
    this.editService.denyRestaurantEdit(editId).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'info',
          summary: 'Edit Denied',
          detail: 'Edit has been rejected and removed',
        });
        this.loadPendingEdits(this.restaurantUrl); // Refresh the list
      },
      error: (error) => {
        console.error('Error denying edit:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to deny edit',
        });
      },
    });
  }

  onEditProposed() {
    this.loadPendingEdits(this.restaurantUrl);
  }
}
