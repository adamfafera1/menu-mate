import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { API_CONFIG } from '../config/api.config';
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
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      console.log('Id mam nadzieje restauracji: ', id);

      fetch(`${API_CONFIG.baseUrl}/Items/Restaurant/${id}`)
        .then((response) => response.json())
        .then((data) => {
          this.items = data;
        })
        .catch((error) => {
          console.error('Error fetching items:', error);
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
}
