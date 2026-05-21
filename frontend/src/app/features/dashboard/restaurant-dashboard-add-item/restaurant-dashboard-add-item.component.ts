// Path: frontend/src/app/features/dashboard/restaurant-dashboard-add-item/restaurant-dashboard-add-item.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.component';
import { IftaLabelModule } from 'primeng/iftalabel';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { API_CONFIG } from '../../../core/config/api.config';
import { FileUploadModule } from 'primeng/fileupload';

interface Alergens {
  name: string;
}

@Component({
  selector: 'app-restaurant-dashboard-add-item',
  standalone: true,
  imports: [
    CommonModule,
    SideMenuComponent,
    IftaLabelModule,
    MultiSelectModule,
    InputNumberModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    TextareaModule,
    ToastModule,
    FileUploadModule
  ],
  templateUrl: './restaurant-dashboard-add-item.component.html',
  styleUrl: './restaurant-dashboard-add-item.component.css',
})
// Komponent panelu administracyjnego odpowiedzialny za dodawanie nowych dań do menu wybranej restauracji
export class RestaurantDashboardAddItemComponent implements OnInit {
  // Wartości parametrów nowego dania powiązane dwukierunkowo z formularzem
  name!: string;
  price!: number;
  description!: string;
  alergens!: Alergens[];
  selectedAlergens!: Alergens[];
  cals: number | undefined;
  carbs: number | undefined;
  fats: number | undefined;
  proteins: number | undefined;
  // Identyfikator restauracji przypisywany na starcie komponentu
  restaurantId: string | null = null;
  // Przechowywanie wybranego pliku obrazu dania wraz z jego podglądem
  uploadedFiles: any[] = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private messageService: MessageService,
  ) { }

  // Inicjalizacja komponentu - odczyt ID restauracji z URL oraz zdefiniowanie słownika alergenów
  ngOnInit(): void {
    // Pobranie identyfikatora z adresu URL aktywnej trasy
    this.restaurantId = this.route.snapshot.paramMap.get('id');
    if (!this.restaurantId) {
      console.error('No restaurant ID provided in URL');
      return;
    }

    // Inicjalizacja predefiniowanej listy alergenów spożywczych do wyboru w formularzu
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

  // Wysłanie nowej pozycji menu (dania) do serwera API oraz opcjonalna wysyłka powiązanej grafiki
  addMenuItem() {
    // Budowa obiektu DTO z danymi nowego dania (wartości odżywcze, nazwa, opis i scalone alergeny)
    const menuItem = {
      restaurantId: this.restaurantId,
      name: this.name,
      price: this.price,
      currency: 0,
      calories: this.cals ?? 0,
      fats: this.fats ?? 0,
      carbs: this.carbs ?? 0,
      proteins: this.proteins ?? 0,
      allergens: this.selectedAlergens?.map((a) => a.name).join(', ') || '',
      description: this.description,
      image: '',
    };

    // Żądanie HTTP POST w celu utworzenia rekordu dania
    this.http.post<any>(`${API_CONFIG.baseUrl}/Items`, menuItem).subscribe({
      next: (response) => {
        const newItemId = response.id;

        // Jeżeli użytkownik załączył plik graficzny dania, rozpoczyna się przesyłanie zdjęcia
        if (this.uploadedFiles.length > 0) {
          const fileToUpload = this.uploadedFiles[0].file;
          const formData = new FormData();
          formData.append('file', fileToUpload);

          // Żądanie HTTP POST przesyłające plik binarny pod dedykowany endpoint dania
          this.http.post(`${API_CONFIG.baseUrl}/Items/${newItemId}/upload-image`, formData).subscribe({
            next: () => {
              this.showSuccess();
              this.clearForm();
            },
            error: (uploadErr) => {
              console.error('Error uploading item image: ', uploadErr);
              this.messageService.add({
                severity: 'warn',
                summary: 'Item added',
                detail: 'Item added, but image upload failed.',
              });
              this.clearForm();
            }
          });
        } else {
          // Przypadek, gdy danie dodano bez przesyłania żadnego zdjęcia
          this.showSuccess();
          this.clearForm();
        }
      },
      // Obsługa błędu w przypadku niewypełnienia obowiązkowych pól formularza
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: 'Cannot add this item, fill all the fields!',
        });
        console.log('Error while adding new item: ', err);
      },
    });
  }

  // Wyświetlenie powiadomienia Toast informującego o pomyślnym utworzeniu pozycji w menu
  private showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'New menu item added!',
    });
  }

  // Przywrócenie wartości wszystkich pól formularza dodawania dania do wartości domyślnych (czyszczenie pól)
  private clearForm(): void {
    this.name = '';
    this.price = 0;
    this.description = '';
    this.selectedAlergens = [];
    this.cals = undefined;
    this.carbs = undefined;
    this.fats = undefined;
    this.proteins = undefined;
    this.uploadedFiles = [];
  }

  // Obsługa wyboru zdjęcia z dysku komputera, ograniczenie limitu do jednego pliku oraz stworzenie podglądu
  onImageSelect(event: any): void {
    // Wyczyszczenie tablicy z ewentualnego wcześniej wybranego pliku (maksymalnie 1 zdjęcie)
    this.uploadedFiles = [];

    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Dodanie pliku binarnego wraz z wygenerowanym podglądem Base64 do lokalnej kolekcji
        this.uploadedFiles.push({
          name: file.name,
          size: file.size,
          objectURL: e.target.result,
          file: file,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  // Usunięcie wybranego wcześniej pliku graficznego z bufora formularza
  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }
}
