//frontend/src/app/features/dashboard/dashboard-item-edits/dashboard-item-edits.component.ts
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { EditService } from '../../../core/services/edit.service';
import { ItemService } from '../../../core/services/item.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-dashboard-item-edits',
  imports: [CardModule, ButtonModule, ToastModule, DatePipe],
  templateUrl: './dashboard-item-edits.component.html',
  styleUrl: './dashboard-item-edits.component.css',
})
// Komponent panelu administracyjnego odpowiedzialny za weryfikację i moderację poszczególnych propozycji zmian zgłoszonych do konkretnego dania
export class DashboardItemEditsComponent implements OnInit {
  pendingEdits: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private editService: EditService,
    private itemService: ItemService,
    private messageService: MessageService,
  ) { }
  itemId: any = null;
  item: any = null;

  // Inicjalizacja komponentu - odczytanie identyfikatora dania z URL lokalu i załadowanie danych z API
  ngOnInit(): void {
    // Odczytanie identyfikatora dania ze ścieżki parametrów aktywnej trasy
    this.itemId = this.route.snapshot.paramMap.get('id');
    // Pobranie listy oczekujących modyfikacji dla tego dania
    this.loadPendingEdits(this.itemId);
    // Pobranie oryginalnych danych pozycji menu w celu porównania pól
    this.loadItem(this.itemId);
    console.log(this.itemId);
  }

  // Pobranie z API listy oczekujących modyfikacji dla konkretnej pozycji menu
  loadPendingEdits(itemId: string) {
    this.editService.getPendingItemEdits(itemId).subscribe({
      next: (edits) => (this.pendingEdits = edits),
      error: (error) => console.error('Error loading edits: ', error),
    });
  }

  // Pobranie z API oryginalnego obiektu dania
  loadItem(itemId: string) {
    this.itemService.getItemById(itemId).subscribe({
      next: (item) => (this.item = item),
      error: (error) => console.error('Error loading item: ', error),
    });
  }

  // Akceptacja wybranej propozycji edycji i zaaplikowanie jej na oryginalny produkt w bazie danych
  approveEdit(editId: string) {
    // Przesłanie zatwierdzenia propozycji edycji o określonym ID do serwera API
    this.editService.approveItemEdit(editId).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Edit approved and applied to restaurant',
        });
        // Ponowne pobranie listy oczekujących poprawek w celu zsynchronizowania stanu widoku
        this.loadPendingEdits(this.itemId);
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

  // Odrzucenie (usunięcie) wybranej propozycji edycji bez modyfikacji oryginalnego produktu
  denyEdit(editId: string) {
    // Przesłanie żądania odrzucenia (usunięcia) propozycji edycji do serwera API
    this.editService.denyItemEdit(editId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Edit Denied',
          detail: 'Edit has been rejected and removed',
        });
        // Odświeżenie lokalnej listy oczekujących poprawek danego dania
        this.loadPendingEdits(this.itemId);
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

  // Odświeżenie listy oczekujących poprawek wybranej pozycji menu
  onEditProposed() {
    this.loadPendingEdits(this.itemId);
  }
}
