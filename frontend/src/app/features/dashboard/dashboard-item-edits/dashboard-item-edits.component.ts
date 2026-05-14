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

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id');
    this.loadPendingEdits(this.itemId);
    this.loadItem(this.itemId);
    console.log(this.itemId);
  }

  loadPendingEdits(itemId: string) {
    this.editService.getPendingItemEdits(itemId).subscribe({
      next: (edits) => (this.pendingEdits = edits),
      error: (error) => console.error('Error loading edits: ', error),
    });
  }

  loadItem(itemId: string) {
    this.itemService.getItemById(itemId).subscribe({
      next: (item) => (this.item = item),
      error: (error) => console.error('Error loading item: ', error),
    });
  }

  approveEdit(editId: string) {
    this.editService.approveItemEdit(editId).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Edit approved and applied to restaurant',
        });
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

  denyEdit(editId: string) {
    this.editService.denyItemEdit(editId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Edit Denied',
          detail: 'Edit has been rejected and removed',
        });
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

  onEditProposed() {
    this.loadPendingEdits(this.itemId);
  }
}
