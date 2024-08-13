import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CreateCampaignModalComponent } from '../../components/create-campaign-modal/create-campaign-modal.component';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { StatusLabelPipe } from '../../pipes/status-label.pipe';
import { PodiumService } from '../../services/podium.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-podium',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    RouterLink,
    RouterOutlet,
    CommonModule,
    CreateCampaignModalComponent,
    StatusLabelPipe,
    DateFormatPipe,
    FormsModule
  ],
  templateUrl: './podium.component.html',
  styleUrls: ['./podium.component.css']
})
export class PodiumComponent {
  activeCampaign: any = {};
  list: any[] = [];
  isModalOpen = false;
  isEditMode = false; // Nueva propiedad
  currentCampaign: any = {}; // Nueva propiedad para la campaña actual
  page = 1;
  pageSize = 5;
  totalItems = 0;
  totalPages = 0;

  constructor(private podiumService: PodiumService) {
    this.getActiveCampaign();
    this.loadCampaignList();
  }

  showCreateModal() {
    this.isEditMode = false;
    this.currentCampaign = {}; // Limpiar la campaña actual
    this.isModalOpen = true;
  }

  showEditModal(campaign: any) {
    this.isEditMode = true;
    this.currentCampaign = campaign;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.loadCampaignList();
  }

  loadCampaignList() {
    this.getActiveCampaign()
    this.podiumService.getCampaignListPag(this.page, this.pageSize).subscribe((response: any) => {
      this.list = response.data.items;
      this.totalItems = response.data.totalItems;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    });
  }

  getActiveCampaign() {
    this.podiumService.getActiveCampaign().subscribe((response: any) => {
      console.log('get active ',response)
      this.activeCampaign = response.data[0] || {};
    });
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.loadCampaignList();
    }
  }
}
