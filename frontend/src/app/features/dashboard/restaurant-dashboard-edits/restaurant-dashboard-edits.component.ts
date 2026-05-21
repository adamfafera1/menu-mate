//frontend/src/app/features/dashboard/restaurant-dashboard-edits/restaurant-dashboard-edits.component.ts
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
// Komponent panelu administracyjnego odpowiedzialny za moderację i zarządzanie propozycjami poprawek profilu restauracji
export class RestaurantDashboardEditsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private editService: EditService,
    private messageService: MessageService,
    private restaurantService: RestaurantService,
  ) { }
  restaurantUrl: any = null;
  restaurant: any = null;
  pendingEdits: any[] = [];

  // Inicjalizacja komponentu - odczytanie identyfikatora lokalu z URL i wywołanie pobierania danych z API
  ngOnInit(): void {
    // Odczytanie identyfikatora restauracji z parametrów aktywnej trasy (URL)
    this.restaurantUrl = this.route.snapshot.paramMap.get('id');
    // Pobranie listy oczekujących poprawek profilu restauracji
    this.loadPendingEdits(this.restaurantUrl);
    // Pobranie podstawowych informacji profilowych restauracji
    this.loadRestaurant(this.restaurantUrl);
    this.restaurantService.getRestaurantById(this.restaurantUrl);
  }

  // Pobranie z API listy oczekujących (niezatwierdzonych) poprawek profilu restauracji
  loadPendingEdits(restaurantId: string) {
    this.editService.getPendingRestaurantEdits(restaurantId).subscribe({
      next: (edits) => (this.pendingEdits = edits),
      error: (error) => console.error('Error loading edits: ', error),
    });
  }

  // Pobranie z API szczegółowych informacji profilowych restauracji
  loadRestaurant(restaurantId: string) {
    this.restaurantService.getRestaurantById(restaurantId).subscribe({
      next: (restaurant) => (this.restaurant = restaurant),
      error: (error) => console.error('Error loading restaurant info', error),
    });
  }

  // Zatwierdzenie wybranej propozycji edycji danych restauracji i automatyczne zaaplikowanie zmian
  approveEdit(editId: string) {
    // Przesłanie żądania HTTP w celu zatwierdzenia zmiany o podanym identyfikatorze
    this.editService.approveRestaurantEdit(editId).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Edit approved and applied to restaurant',
        });
        // Ponowne załadowanie listy oczekujących poprawek w celu zsynchronizowania stanu widoku
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

  // Odrzucenie (anulowanie) wybranej propozycji edycji profilu restauracji
  denyEdit(editId: string) {
    // Przesłanie żądania HTTP w celu usunięcia/odrzucenia propozycji poprawki o określonym identyfikatorze
    this.editService.denyRestaurantEdit(editId).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'info',
          summary: 'Edit Denied',
          detail: 'Edit has been rejected and removed',
        });
        // Odświeżenie lokalnej listy oczekujących poprawek
        this.loadPendingEdits(this.restaurantUrl);
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

  // Reakcja na zewnętrzne zdarzenie zgłoszenia poprawki - wywołanie odświeżenia listy
  onEditProposed() {
    this.loadPendingEdits(this.restaurantUrl);
  }
}
