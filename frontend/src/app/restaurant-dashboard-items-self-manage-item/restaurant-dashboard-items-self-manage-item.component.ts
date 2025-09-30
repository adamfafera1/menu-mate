import { Component } from '@angular/core';
import { SideMenuComponent } from "../side-menu/side-menu.component";
import { IftaLabelModule } from 'primeng/iftalabel';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

interface Alergens {
  name: string;
}

@Component({
  selector: 'app-restaurant-dashboard-items-self-manage-item',
  imports: [SideMenuComponent, IftaLabelModule, TextareaModule, CommonModule, FormsModule, InputTextModule, ToastModule, ButtonModule, InputNumberModule, MultiSelectModule],
  templateUrl: './restaurant-dashboard-items-self-manage-item.component.html',
  styleUrl: './restaurant-dashboard-items-self-manage-item.component.css',
  providers: [MessageService]
})
export class RestaurantDashboardItemsSelfManageItemComponent {
  name: string | undefined;
  description: string | undefined;
  item: any = null;
  alergens!: Alergens[];
  selectedAlergens!: Alergens[];
  price: number | undefined;
  cals: number | undefined;
  carbs: number | undefined;
  fats: number | undefined;
  proteins: number | undefined;
  restaurantId: string | null = null;
  itemId: string | null = null;
  loading: boolean = true;


  constructor(private messageService: MessageService, private route: ActivatedRoute, private http: HttpClient) {}

  onUpload(event: UploadEvent) {
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
  }

  updateItem(): void {
    if (!this.itemId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Item ID not found' });
      return;
    }

    if (!this.name || !this.description || !this.price) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields' });
      return;
    }

    this.loading = true;
    
    const updateData = {
      name: this.name,
      description: this.description,
      price: this.price,
      calories: this.cals || 0,
      carbs: this.carbs || 0,
      fats: this.fats || 0,
      proteins: this.proteins || 0,
      allergens: this.selectedAlergens?.map(a => a.name).join(', ') || ''
    };

    this.http.put(`https://localhost:7084/api/Items/${this.itemId}`, updateData)
      .subscribe({
        next: (response) => {
          console.log('Item updated successfully:', response);
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'Item updated successfully' 
          });
          this.loading = false;
          
          this.fetchItemData();
        },
        error: (error) => {
          console.error('Error updating item:', error);
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Failed to update item' 
          });
          this.loading = false;
        }
      });
  }

  cancelUpdate(): void {
    if (this.item) {
      this.name = this.item.name;
      this.description = this.item.description;
      this.price = this.item.price;
      this.cals = this.item.calories;
      this.carbs = this.item.carbohydrates;
      this.fats = this.item.fats;
      this.proteins = this.item.proteins;
      
      if (this.item.allergens) {
        this.selectedAlergens = this.alergens.filter(allergen => 
          this.item.allergens.includes(allergen.name)
        );
      } else {
        this.selectedAlergens = [];
      }
    }
    
    this.messageService.add({ 
      severity: 'info', 
      summary: 'Cancelled', 
      detail: 'Changes have been cancelled' 
    });
  }

  ngOnInit(): void {
    this.restaurantId = this.route.snapshot.paramMap.get('id');
    const routeParams = this.route.snapshot.url;
    
    if (routeParams.length >= 4) {
      this.itemId = routeParams[routeParams.length - 1].path;
    }

    console.log('Restaurant ID:', this.restaurantId);
    console.log('Item ID:', this.itemId);

    if (this.itemId) {
      this.fetchItemData();
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Item ID not found' });
      this.loading = false;
    }
    
    this.alergens = [
      {name: 'None'},
      {name: 'Cereals containing gluten'},
      {name: 'Crustaceans'},
      {name: 'Eggs'},
      {name: 'Fish'},
      {name: 'Peanuts'},
      {name: 'Soybeans'},
      {name: 'Milk'},
      {name: 'Nuts'},
      {name: 'Celery'},
      {name: 'Mustard'},
      {name: 'Sesame seeds'},
      {name: 'Sulphites'},
      {name: 'Lupin'},
      {name: 'Molluscs'},
    ];
  }

  fetchItemData(): void {
    this.loading = true;
    
    this.http.get(`https://localhost:7084/api/Items/${this.itemId}`)
      .subscribe({
        next: (data: any) => {
          this.item = data;
          
          this.name = data.name;
          this.description = data.description;
          this.price = data.price;
          this.cals = data.calories;
          this.carbs = data.carbs;
          this.fats = data.fats;
          this.proteins = data.proteins;
          
          if (data.allergens) {
            const allergenNames = data.allergens.split(',').map((a: string) => a.trim());
            this.selectedAlergens = this.alergens.filter(allergen => 
              allergenNames.includes(allergen.name)
            );
          }
          
          this.loading = false;
          console.log('Item data loaded:', this.item);
        },
        error: (error) => {
          console.error('Error fetching item data:', error);
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Failed to load item data' 
          });
          this.loading = false;
        }
      });
  }

  

}
