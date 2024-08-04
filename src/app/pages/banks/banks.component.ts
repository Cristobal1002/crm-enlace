import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-banks',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, CommonModule, FormsModule],
  templateUrl: './banks.component.html',
  styleUrl: './banks.component.css'
})
export class BanksComponent {
  banks = [
    {nombre: 'Cristobal Sosa', account:'0097 7007 3840 - C. Recaudo 01080860', createdAt:'10-01-2024', status:'active'}
  ]
}
