import { Component, signal, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReviewItemComponent } from "../review-item/review-item.component";
import { ProposeItemEditComponent} from '../propose-item-edit/propose-item-edit.component';
import { ReviewItemMakeComponent } from "../review-item-make/review-item-make.component";


enum Currency {
  PLN = 0,
  USD = 1,
  EUR = 2,
}

@Component({
  selector: 'app-menu-item-card',
  imports: [CardModule, ButtonModule, DialogModule, TabsModule, TableModule, RatingModule, FormsModule, ReviewItemComponent, ProposeItemEditComponent, ReviewItemMakeComponent],
  templateUrl: './menu-item-card.component.html',
  styleUrl: './menu-item-card.component.css'
})
export class MenuItemCardComponent implements OnChanges {
  @Input() searchQuery: string = '';
  
  visible : boolean = false;
  visibleEdit : boolean = false;
  visibleReview : boolean = false;
  items : any[] = [];
  filteredItems : any[] = [];
  value : number = 4;
  selectedItem = signal<any | null>(null);

  constructor(private route: ActivatedRoute) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchQuery']) {
      this.filterItems();
    }
  }

  filterItems() {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      this.filteredItems = [...this.items];
    } else {
      this.filteredItems = this.items.filter(item => 
        item.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  showDialog(item: any) {
    this.selectedItem.set(item) ;
    this.visible = true;
    console.log('Selected item: ', item);
  }

  showEdit(){
    this.visibleEdit = true;
  }

  hideEdit(){
    this.visibleEdit = false;
  }

  showReview(){
    this.visibleReview = true;
  }
  
  hideReview(){
    this.visibleReview = false;
  }

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

  ngOnInit() {

    const urlID = this.route.snapshot.paramMap.get('id');

    fetch(`https://localhost:7084/api/Items/Restaurant/${urlID}`)
      .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch items data');
      }
      return response.json();
      })
      .then(data => {
      this.items = data;
      this.filterItems();
      console.log(this.items)
      })
      .catch(error => {
      console.error('Error fetching items:', error);
      });
  }
}