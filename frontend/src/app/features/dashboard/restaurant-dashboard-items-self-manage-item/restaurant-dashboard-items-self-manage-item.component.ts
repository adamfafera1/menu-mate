//frontend/src/app/features/dashboard/restaurant-dashboard-items-self-manage-item/restaurant-dashboard-items-self-manage-item.component.ts
import { Component, OnInit } from '@angular/core';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.component';
import { IftaLabelModule } from 'primeng/iftalabel';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { API_CONFIG } from '../../../core/config/api.config';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MediaService } from '../../../core/services/media.service';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

interface Alergens {
  name: string;
}

@Component({
  selector: 'app-restaurant-dashboard-items-self-manage-item',
  imports: [
    SideMenuComponent,
    IftaLabelModule,
    TextareaModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    ToastModule,
    ButtonModule,
    InputNumberModule,
    MultiSelectModule,
  ],
  templateUrl: './restaurant-dashboard-items-self-manage-item.component.html',
  styleUrl: './restaurant-dashboard-items-self-manage-item.component.css',
})
// Komponent panelu administracyjnego odpowiedzialny za edycję pojedynczej potrawy (pozycji menu) restauracji
export class RestaurantDashboardItemsSelfManageItemComponent implements OnInit {
  name: string | undefined;
  description: string | undefined;
  item: any = null;
  alergens!: Alergens[];
  selectedAlergens!: Alergens[];
  price: number | undefined;
  cals: number | undefined;
  carbs: number | undefined;
  fats: number | undefined;
  proteins: number | undefined;
  restaurantId: string | null = null;
  itemId: string | null = null;
  loading: boolean = true;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private http: HttpClient,
    public mediaService: MediaService
  ) { }

  // Obsługa przesyłania nowego pliku graficznego potrawy do chmury za pośrednictwem serwisu API
  onUpload(event: any) {
    // Weryfikacja obecności pliku graficznego
    if (event.files && event.files.length > 0) {
      const file = event.files[0];

      // Sprawdzanie poprawności identyfikatora dania
      if (!this.itemId) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Item ID not found',
        });
        return;
      }

      // Ustawienie stanu ładowania i przygotowanie danych do wysłania
      this.loading = true;
      const formData = new FormData();
      formData.append('file', file);

      // Wywołanie żądania HTTP POST wysyłającego plik binarny na dedykowany endpoint dania
      this.http.post<{ imagePath: string }>(`${API_CONFIG.baseUrl}/Items/${this.itemId}/upload-image`, formData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Item image updated successfully'
          });
          // Ponowne pobranie danych dania w celu zsynchronizowania stanu komponentu
          this.fetchItemData();
        },
        // Obsługa błędów
        error: (error) => {
          console.error('Upload failed:', error);
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update item image'
          });
        }
      });
    }
  }

  // Wysłanie zaktualizowanych wartości i wartości odżywczych potrawy do serwera API
  updateItem(): void {
    if (!this.itemId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Item ID not found',
      });
      return;
    }

    // Walidacja uzupełnienia podstawowych pól wymaganych formularza
    if (!this.name || !this.description || !this.price) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields',
      });
      return;
    }

    this.loading = true;

    // Przygotowanie obiektu DTO z zaktualizowanymi szczegółami (nazwa, makroskładniki, scalone alergeny)
    const updateData = {
      restaurantId: this.item?.restaurantId,
      name: this.name,
      description: this.description,
      price: this.price,
      currency: this.item?.currency || 0,
      calories: this.cals || 0,
      carbs: this.carbs || 0,
      fats: this.fats || 0,
      proteins: this.proteins || 0,
      allergens: this.selectedAlergens?.map((a) => a.name).join(', ') || '',
      image: this.item?.image || '',
    };

    // Wysłanie żądania HTTP PUT w celu trwałego zapisania zmian w bazie danych
    this.http
      .put(`${API_CONFIG.baseUrl}/Items/${this.itemId}`, updateData)
      .subscribe({
        next: (response) => {
          console.log('Item updated successfully:', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Item updated successfully',
          });
          this.loading = false;

          // Ponowne załadowanie danych z bazy w celu odświeżenia pól
          this.fetchItemData();
        },
        error: (error) => {
          console.error('Error updating item:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update item',
          });
          this.loading = false;
        },
      });
  }

  // Przywrócenie pierwotnych wartości pól formularza sprzed edycji i odrzucenie zmian
  cancelUpdate(): void {
    if (this.item) {
      this.name = this.item.name;
      this.description = this.item.description;
      this.price = this.item.price;
      this.cals = this.item.calories;
      this.carbs = this.item.carbohydrates;
      this.fats = this.item.fats;
      this.proteins = this.item.proteins;

      // Zmapowanie oryginalnych alergenów z tekstu z powrotem na wybrane obiekty tablicy
      if (this.item.allergens) {
        this.selectedAlergens = this.alergens.filter((allergen) =>
          this.item.allergens.includes(allergen.name),
        );
      } else {
        this.selectedAlergens = [];
      }
    }

    this.messageService.add({
      severity: 'info',
      summary: 'Cancelled',
      detail: 'Changes have been cancelled',
    });
  }

  // Inicjalizacja komponentu - odczytanie identyfikatorów z URL oraz słownika alergenów
  ngOnInit(): void {
    // Odczytanie identyfikatora restauracji z parametrów aktywnej trasy
    this.restaurantId = this.route.snapshot.paramMap.get('id');
    const routeParams = this.route.snapshot.url;

    // Ekstrakcja identyfikatora dania z ostatniego segmentu ścieżki URL
    if (routeParams.length >= 4) {
      this.itemId = routeParams[routeParams.length - 1].path;
    }

    console.log('Restaurant ID:', this.restaurantId);
    console.log('Item ID:', this.itemId);

    if (this.itemId) {
      // Wywołanie asynchronicznego pobierania szczegółów potrawy
      this.fetchItemData();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Item ID not found',
      });
      this.loading = false;
    }

    // Definicja dostępnych w systemie alergenów do wyboru
    this.alergens = [
      { name: 'None' },
      { name: 'Cereals containing gluten' },
      { name: 'Crustaceans' },
      { name: 'Eggs' },
      { name: 'Fish' },
      { name: 'Peanuts' },
      { name: 'Soybeans' },
      { name: 'Milk' },
      { name: 'Nuts' },
      { name: 'Celery' },
      { name: 'Mustard' },
      { name: 'Sesame seeds' },
      { name: 'Sulphites' },
      { name: 'Lupin' },
      { name: 'Molluscs' },
    ];
  }

  // Pobranie z API pełnych danych szczegółowych potrawy
  fetchItemData(): void {
    this.loading = true;

    // Zapytanie HTTP GET po szczegóły dania
    this.http.get(`${API_CONFIG.baseUrl}/Items/${this.itemId}`).subscribe({
      next: (data: any) => {
        this.item = data;

        // Mapowanie pobranych wartości na pola formularza w widoku HTML
        this.name = data.name;
        this.description = data.description;
        this.price = data.price;
        this.cals = data.calories;
        this.carbs = data.carbs;
        this.fats = data.fats;
        this.proteins = data.proteins;

        // Rozbicie po przecinku tekstu alergenów z bazy danych i zaznaczenie odpowiednich pól multiselect
        if (data.allergens) {
          const allergenNames = data.allergens
            .split(',')
            .map((a: string) => a.trim());
          this.selectedAlergens = this.alergens.filter((allergen) =>
            allergenNames.includes(allergen.name),
          );
        }

        this.loading = false;
        console.log('Item data loaded:', this.item);
      },
      error: (error) => {
        console.error('Error fetching item data:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load item data',
        });
        this.loading = false;
      },
    });
  }
}
