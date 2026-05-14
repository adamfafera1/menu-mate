import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ItemService } from '../services/item.service';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';

enum Currency {
  PLN = 0,
  USD = 1,
  EUR = 2,
}

@Component({
  selector: 'app-dashboard-items-component',
  imports: [CardModule, BadgeModule, ToastModule],
  templateUrl: './dashboard-items-component.component.html',
  styleUrl: './dashboard-items-component.component.css',
})
export class DashboardItemsComponentComponent implements OnInit {
  items: any[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private itemService: ItemService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      console.log('Id mam nadzieje restauracji: ', id);

      if (!id) return;

      this.itemService.getItemsByRestaurantId(id).subscribe({
        next: (data) => {
          this.items = data;
        },
        error: (error) => {
          console.error('Error fetching items:', error);
        }
      });
    });
  }

  goToItem(itemId: number) {
    this.router.navigate([this.router.url + '/' + itemId]);
  }

  getCurrencySymbol(currency: number): string {
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

  getImageUrl(path: string | undefined): string {
    if (!path) return 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500';
    if (path.startsWith('http')) return path;
    const serverUrl = API_CONFIG.baseUrl.replace('/api', '');
    return `${serverUrl}${path}`;
  }
}
