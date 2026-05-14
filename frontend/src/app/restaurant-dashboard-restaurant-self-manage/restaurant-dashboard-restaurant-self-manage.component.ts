import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { IftaLabel } from 'primeng/iftalabel';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';
import { RestaurantService } from '../services/restaurant.service';
import { MediaService } from '../services/media.service';
import { GeolocationService } from '../services/geolocation.service';

@Component({
  selector: 'app-restaurant-dashboard-restaurant-self-manage',
  imports: [
    CommonModule,
    IftaLabel,
    FormsModule,
    FileUploadModule,
    SideMenuComponent,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    InputMaskModule,
    InputTextModule,
    TextareaModule,
    MultiSelectModule,
    SelectModule,
    AutoCompleteModule,
    IconFieldModule,
    InputIconModule,
  ],
  standalone: true,
  templateUrl: './restaurant-dashboard-restaurant-self-manage.component.html',
  styleUrl: './restaurant-dashboard-restaurant-self-manage.component.css',
})
export class RestaurantDashboardRestaurantSelfManageComponent implements OnInit {
  name: string | undefined;
  description: string | undefined;
  phone: string | undefined;
  location: string | undefined;
  uploadedFiles: any[] = [];
  selectedCuisine: string | null = null;
  cuisineOptions: string[] = [
    'Italian', 'Japanese', 'Chinese', 'Mexican', 'Indian',
    'French', 'Thai', 'American', 'Mediterranean', 'Greek',
    'Spanish', 'Korean', 'Vietnamese', 'Middle Eastern', 'Other'
  ];
  restaurant: any = null;
  restaurantId: string | null = null;
  loading: boolean = true;
  locationSuggestions: any[] = [];
  selectedLocationObj: any = null;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private restaurantService: RestaurantService,
    public mediaService: MediaService,
    private geolocationService: GeolocationService
  ) { }

  ngOnInit(): void {
    this.restaurantId = this.route.snapshot.paramMap.get('id');

    console.log('Restaurant ID:', this.restaurantId);

    if (this.restaurantId) {
      this.fetchRestaurantData();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Restaurant ID not found',
      });
      this.loading = false;
    }
  }

  fetchRestaurantData(): void {
    this.loading = true;

    this.http
      .get(`${API_CONFIG.baseUrl}/Restaurants/${this.restaurantId}`)
      .subscribe({
        next: (data: any) => {
          this.restaurant = data;

          this.name = data.name;
          this.description = data.description;
          this.location = data.location;
          this.selectedLocationObj = data.location ? { label: data.location } : null;
          this.phone = data.phone;
          this.selectedCuisine = data.cuisine ?? null;

          this.loading = false;
          console.log('Restaurant data loaded:', this.restaurant);
        },
        error: (error) => {
          console.error('Error fetching restaurant data:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load restaurant data',
          });
          this.loading = false;
        },
      });
  }

  confirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Save',
      },
      accept: () => {
        this.updateRestaurant();
      },
    });
  }

  updateRestaurant(): void {
    if (!this.restaurantId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Restaurant ID not found',
      });
      return;
    }

    const locationText = this.selectedLocationObj
      ? (typeof this.selectedLocationObj === 'string'
          ? this.selectedLocationObj
          : this.selectedLocationObj.label)
      : this.location;

    if (!this.name || !this.description || !locationText || !this.phone) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields',
      });
      return;
    }

    this.loading = true;

    const updateData = {
      name: this.name,
      description: this.description,
      location: locationText,
      phone: this.phone,
      rating: this.restaurant?.rating || 0,
      imagePath:
        this.restaurant?.imagePath ||
        'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500',
      cuisine: this.selectedCuisine ?? null,
    };

    this.http
      .put(`${API_CONFIG.baseUrl}/Restaurants/${this.restaurantId}`, updateData)
      .subscribe({
        next: (response) => {
          console.log('Restaurant updated successfully:', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Restaurant information updated successfully',
          });
          this.loading = false;

          this.fetchRestaurantData();
        },
        error: (error) => {
          console.error('Error updating restaurant:', error);

          this.loading = false;
        },
      });
  }

  cancel() {
    if (this.restaurant) {
      this.name = this.restaurant.name;
      this.description = this.restaurant.description;
      this.location = this.restaurant.location;
      this.selectedLocationObj = this.restaurant.location ? { label: this.restaurant.location } : null;
      this.phone = this.restaurant.phone;
      this.selectedCuisine = this.restaurant.cuisine ?? null;
    }

    this.messageService.add({
      severity: 'info',
      summary: 'Cancelled',
      detail: 'Changes have been cancelled',
    });
  }

  onUpload(event: any) {
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      if (!this.restaurantId) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Restaurant ID not found',
        });
        return;
      }

      this.loading = true;
      this.restaurantService.uploadRestaurantImage(this.restaurantId, file).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Restaurant image updated successfully'
          });
          // Refresh data to get new image
          this.fetchRestaurantData();
        },
        error: (error) => {
          console.error('Upload failed:', error);
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update restaurant image'
          });
        }
      });
    }
  }

  searchLocation(event: any): void {
    this.geolocationService.searchLocations(event.query).subscribe({
      next: (results) => {
        this.locationSuggestions = results;
      },
      error: () => {
        this.locationSuggestions = [];
      }
    });
  }

  onLocationSelect(event: any): void {
    const place = event?.value ?? event;
    this.location = place.label;
  }

  onLocationClear(): void {
    this.selectedLocationObj = null;
    this.locationSuggestions = [];
  }

}
