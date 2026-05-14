import { Component } from '@angular/core';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-add-item',
  imports: [FormsModule, TextareaModule, FloatLabelModule, IconFieldModule, InputIconModule],
  templateUrl: './dashboard-add-item.component.html',
  styleUrl: './dashboard-add-item.component.css'
})
export class DashboardAddItemComponent {
  valueOn : string = '';

}
