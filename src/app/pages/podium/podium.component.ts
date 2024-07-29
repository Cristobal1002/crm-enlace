import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CreateCampaignModalComponent } from '../../components/create-campaign-modal/create-campaign-modal.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-podium',
  standalone: true,
  imports: [HeaderComponent,SidebarComponent, RouterLink, RouterOutlet, CommonModule, CreateCampaignModalComponent],
  templateUrl: './podium.component.html',
  styleUrl: './podium.component.css'
})
export class PodiumComponent {

  items = [
    { nombre: 'Sigo confiando en él', rhema: 'Salmos 9:10', meta: 10000, fechaCreacion: '10-05-2024', status: 'active' },
    // ... más datos
  ];

  isModalOpen = false;

  showModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

}
