// Path: frontend/src/app/shared/components/menu-item-card/menu-item-card.component.ts
import {
  Component,
  signal,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReviewItemComponent } from '../../../features/browse/review-item/review-item.component';
import { ProposeItemEditComponent } from '../../../features/browse/propose-item-edit/propose-item-edit.component';
import { ReviewItemMakeComponent } from '../../../features/browse/review-item-make/review-item-make.component';
import { API_CONFIG } from '../../../core/config/api.config';
import { ItemService } from '../../../core/services/item.service';
import { MediaService } from '../../../core/services/media.service';

// Typ wyliczeniowy reprezentujący walutę używaną do wyświetlania cen dań
enum Currency {
  PLN = 0,
  USD = 1,
  EUR = 2,
}

@Component({
  selector: 'app-menu-item-card',
  imports: [
    CardModule,
    ButtonModule,
    DialogModule,
    TabsModule,
    TableModule,
    RatingModule,
    FormsModule,
    ReviewItemComponent,
    ProposeItemEditComponent,
    ReviewItemMakeComponent,
  ],
  templateUrl: './menu-item-card.component.html',
  styleUrl: './menu-item-card.component.css',
})
// Komponent prezentujący asortyment menu danej restauracji w formie kart, z obsługą wyszukiwania, szczegółów i opinii
export class MenuItemCardComponent implements OnChanges {
  @Input() searchQuery: string = '';

  visible: boolean = false;
  visibleEdit: boolean = false;
  visibleReview: boolean = false;
  items: any[] = [];
  filteredItems: any[] = [];
  value: number = 4;
  selectedItem = signal<any | null>(null);

  constructor(private route: ActivatedRoute, private itemService: ItemService, public mediaService: MediaService) { }

  // Reakcja na zmianę parametrów wejściowych - uruchomienie filtrowania dań przy zmianie zapytania wyszukiwarki
  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchQuery']) {
      this.filterItems();
    }
  }

  // Filtrowanie listy dań na podstawie zgodności nazwy lub opisu z frazą wpisaną przez użytkownika
  filterItems() {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      this.filteredItems = [...this.items];
    } else {
      this.filteredItems = this.items.filter(
        (item) =>
          item.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          item.description
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()),
      );
    }
  }

  // Otwarcie okna dialogowego szczegółów dla konkretnego dania z menu
  showDialog(item: any) {
    this.selectedItem.set(item);
    this.visible = true;
    console.log('Selected item: ', item);
  }

  // Wyświetlenie formularza zgłaszania propozycji poprawek danego produktu
  showEdit() {
    this.visibleEdit = true;
  }

  // Ukrycie formularza zgłaszania propozycji poprawek
  hideEdit() {
    this.visibleEdit = false;
  }

  // Wyświetlenie okna dialogowego do dodawania opinii i oceny produktu
  showReview() {
    this.visibleReview = true;
  }

  // Ukrycie okna dialogowego dodawania opinii
  hideReview() {
    this.visibleReview = false;
  }

  // Mapowanie typu wyliczeniowego waluty na odpowiadający mu symbol graficzny
  getCurrencySymbol(currency: Currency): string {
    switch (currency) {
      case Currency.PLN:
        return 'zł';
      case Currency.USD:
        return '$';
      case Currency.EUR:
        return '€';
      default:
        return '';
    }
  }

  // Inicjalizacja komponentu - pobranie z API listy dań powiązanych z aktualnie przeglądaną restauracją (ID z URL)
  ngOnInit() {
    const urlID = this.route.snapshot.paramMap.get('id');

    if (!urlID) return;

    this.itemService.getItemsByRestaurantId(urlID).subscribe({
      next: (data) => {
        this.items = data;
        this.filterItems();
        console.log(this.items);
      },
      error: (error) => {
        console.error('Error fetching items:', error);
      }
    });
  }
}
