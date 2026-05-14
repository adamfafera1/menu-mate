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
export class RestaurantDashboardAddItemComponent implements OnInit {
  name!: string;
  price!: number;
  description!: string;
  alergens!: Alergens[];
  selectedAlergens!: Alergens[];
  cals: number | undefined;
  carbs: number | undefined;
  fats: number | undefined;
  proteins: number | undefined;
  restaurantId: string | null = null;
  uploadedFiles: any[] = [];

  ngOnInit(): void {
    this.restaurantId = this.route.snapshot.paramMap.get('id');
    if (!this.restaurantId) {
      console.error('No restaurant ID provided in URL');
      return;
    }

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

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private messageService: MessageService,
  ) {}

  addMenuItem() {
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

    this.http.post(`${API_CONFIG.baseUrl}/Items`, menuItem).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'New menu item added!',
        });
        console.log('Successfully added new item: ', response);
        this.clearForm();
      },
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

  private clearForm(): void {
    this.name = '';
    this.price = 0;
    this.description = '';
    this.selectedAlergens = [];
    this.cals = undefined;
    this.carbs = undefined;
    this.fats = undefined;
    this.proteins = undefined;
  }

  onImageSelect(event: any): void {
    // Only allow 1 file, so clear previous uploads
    this.uploadedFiles = [];
    
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
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

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }
}
