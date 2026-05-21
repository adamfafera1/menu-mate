//frontend/src/app/features/dashboard/restaurant-dashboard-restaurant-self-manage/restaurant-dashboard-restaurant-self-manage.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { IftaLabel } from 'primeng/iftalabel';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.component';
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
import { API_CONFIG } from '../../../core/config/api.config';
import { RestaurantService } from '../../../core/services/restaurant.service';
import { MediaService } from '../../../core/services/media.service';
import { GeolocationService } from '../../../core/services/geolocation.service';

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
// Komponent panelu administracyjnego umożliwiający bezpośrednie zarządzanie danymi profilowymi restauracji
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

  // Inicjalizacja komponentu - odczytanie identyfikatora restauracji i pobranie jej profilu
  ngOnInit(): void {
    // Odczytanie parametru ID z adresu URL aktywnej trasy
    this.restaurantId = this.route.snapshot.paramMap.get('id');

    console.log('Restaurant ID:', this.restaurantId);

    if (this.restaurantId) {
      // Wywołanie pobierania danych szczegółowych
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

  // Pobranie szczegółowych informacji o restauracji z API i zmapowanie ich na formularz
  fetchRestaurantData(): void {
    this.loading = true;

    // Żądanie HTTP GET po dane szczegółowe lokalu
    this.http
      .get(`${API_CONFIG.baseUrl}/Restaurants/${this.restaurantId}`)
      .subscribe({
        next: (data: any) => {
          this.restaurant = data;

          // Przypisanie pobranych wartości do pól formularza w widoku HTML
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

  // Wyświetlenie okna dialogowego z zapytaniem potwierdzającym chęć zapisu zmian
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
        // Uruchomienie właściwej procedury aktualizacji po zaakceptowaniu dialogu
        this.updateRestaurant();
      },
    });
  }

  // Przesłanie uaktualnionych informacji o lokalu gastronomicznym na serwer API
  updateRestaurant(): void {
    // Sprawdzenie poprawności identyfikatora
    if (!this.restaurantId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Restaurant ID not found',
      });
      return;
    }

    // Wyodrębnienie tekstu lokalizacji z wybranego obiektu geolokalizacyjnego (obsługa formatu tekstowego i obiektowego)
    const locationText = this.selectedLocationObj
      ? (typeof this.selectedLocationObj === 'string'
        ? this.selectedLocationObj
        : this.selectedLocationObj.label)
      : this.location;

    // Walidacja wypełnienia wszystkich pól obowiązkowych formularza
    if (!this.name || !this.description || !locationText || !this.phone) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields',
      });
      return;
    }

    this.loading = true;

    // Konstrukcja DTO z zaktualizowanymi wartościami restauracji
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

    // Wysłanie zapytania HTTP PUT z uaktualnionymi danymi
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

          // Ponowne pobranie danych w celu odświeżenia stanu komponentu
          this.fetchRestaurantData();
        },
        error: (error) => {
          console.error('Error updating restaurant:', error);
          this.loading = false;
        },
      });
  }

  // Przywrócenie pierwotnych wartości pól formularza sprzed edycji i odrzucenie niezapisanych zmian
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

  // Obsługa przesyłania nowego pliku graficznego reprezentującego restaurację do chmury (Azure Blob Storage)
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
      // Wysłanie grafiki do magazynu Azure za pośrednictwem dedykowanej metody serwisu restauracji
      this.restaurantService.uploadRestaurantImage(this.restaurantId, file).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Restaurant image updated successfully'
          });
          // Ponowne pobranie danych w celu uaktualnienia ścieżki i odświeżenia widoku
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

  // Asynchroniczne wyszukiwanie geolokalizacyjne pasujących adresów za pomocą Nominatim OpenStreetMap API
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

  // Przypisanie wybranego adresu z listy podpowiedzi do lokalnej zmiennej formularza
  onLocationSelect(event: any): void {
    const place = event?.value ?? event;
    this.location = place.label;
  }

  // Wyczyszczenie zaznaczonego obiektu lokalizacji oraz listy sugestii w wyszukiwarce
  onLocationClear(): void {
    this.selectedLocationObj = null;
    this.locationSuggestions = [];
  }

}
