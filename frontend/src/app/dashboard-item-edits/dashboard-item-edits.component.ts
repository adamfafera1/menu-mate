import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { API_CONFIG } from '../config/api.config';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-item-edits',
  imports: [CardModule, ButtonModule, ToastModule, DatePipe],
  templateUrl: './dashboard-item-edits.component.html',
  styleUrl: './dashboard-item-edits.component.css',
  providers: [MessageService],
})
export class DashboardItemEditsComponent implements OnInit {
  pendingEdits: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private messageService: MessageService,
  ) {}
  itemId: any = null;
  item: any = null;

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id');
    this.loadPendingEdits(this.itemId);
    this.loadItem(this.itemId);
    console.log(this.itemId);
  }

  loadPendingEdits(itemId: string) {
    this.http
      .get<any[]>(`${API_CONFIG.baseUrl}/EditItems/${itemId}`)
      .subscribe({
        next: (edits) => (this.pendingEdits = edits),
        error: (error) => console.error('Error loading edits: ', error),
      });
  }

  loadItem(itemId: string) {
    this.http.get<any>(`${API_CONFIG.baseUrl}/Items/${itemId}`).subscribe({
      next: (item) => (this.item = item),
      error: (error) => console.error('Error loading item: ', error),
    });
  }

  approveEdit(editId: string) {
    this.http
      .put(`${API_CONFIG.baseUrl}/EditItems/${editId}/approve`, {})
      .subscribe({
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
    this.http
      .delete(`${API_CONFIG.baseUrl}/EditItems/${editId}`, {
        responseType: 'text',
      })
      .subscribe({
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
