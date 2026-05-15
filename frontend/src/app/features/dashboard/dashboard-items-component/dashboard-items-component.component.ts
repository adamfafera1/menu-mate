import { Component, OnInit, DestroyRef, inject, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ItemService } from '../../../core/services/item.service';
import { MediaService } from '../../../core/services/media.service';
import { EditService } from '../../../core/services/edit.service';
import { forkJoin, catchError, of } from 'rxjs';
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
  standalone: true,
  imports: [CardModule, BadgeModule, ToastModule],
  templateUrl: './dashboard-items-component.component.html',
  styleUrl: './dashboard-items-component.component.css',
})
export class DashboardItemsComponentComponent implements OnInit {
  @Input() onlyWithEdits: boolean = false;
  @Input() onlyWithReviews: boolean = false;
  items: any[] = [];
  allLoadedItems: any[] = [];

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private itemService: ItemService,
    public mediaService: MediaService,
    private editService: EditService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const id = params.get('id');
      console.log('Id mam nadzieje restauracji: ', id);

      if (!id) return;

      forkJoin({
        items: this.itemService.getItemsByRestaurantId(id),
        edits: this.editService.getPendingItemEditsByRestaurant(id).pipe(
          catchError(err => {
            console.error('Error fetching edits, showing items anyway:', err);
            return of([]);
          })
        )
      }).subscribe({
        next: ({ items, edits }) => {
          this.allLoadedItems = items.map(item => ({
            ...item,
            pendingEditsCount: edits.filter(e => e.itemId === item.id).length
          }));
          this.filterItems();
        },
        error: (error) => {
          console.error('Error fetching items:', error);
        }
      });
    });
  }

  private filterItems() {
    this.items = this.allLoadedItems;
    if (this.onlyWithEdits) {
      this.items = this.items.filter(item => item.pendingEditsCount > 0);
    }
    if (this.onlyWithReviews) {
      this.items = this.items.filter(item => item.reviews > 0);
    }
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
