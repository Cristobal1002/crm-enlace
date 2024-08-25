import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CreateCampaignModalComponent } from '../../components/create-campaign-modal/create-campaign-modal.component';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { StatusLabelPipe } from '../../pipes/status-label.pipe';
import { AuthServiceService } from '../../services/auth-service.service';
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
    FormsModule  ],
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
  currentUser: any;

  constructor(private podiumService: PodiumService, private authService: AuthServiceService) {
    this.currentUser = this.authService.getUserData();
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
    this.loadCampaignList();
    this.isModalOpen = false;
  }

  loadCampaignList(name?:string) {
    this.getActiveCampaign()
    this.podiumService.getCampaignListPag(this.page, this.pageSize, name).subscribe((response: any) => {
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


  toggleStatus(item: any): void {
    if (!item.status) {
      // Desactivar todas las demás campañas
      this.list.forEach(campaign => {
        if (campaign !== item) {
          campaign.status = false;
        }
      });
    }
    // Activar o desactivar la campaña seleccionada
    item.status = !item.status;

    // Aquí debes hacer la llamada a tu servicio para actualizar el estado en tu base de datos
    this.updateCampaignStatus(item);
  }

  updateCampaignStatus(item: any): void {
   const id = item.id
   const updated_by = this.currentUser.user
   if(item.id == this.activeCampaign.id){
    this.updateCampaign();
  }else{
    this.podiumService.activateCampaign({id, updated_by}).subscribe(response=>{
      console.log('respnse en activate podium',response)
      this.loadCampaignList();
     })
   }
   
  }

  updateCampaign(){
    this.podiumService.updateCampaign(this.activeCampaign.id,{updated_by: this.currentUser.user, status:false}).subscribe(response => {
      console.log('update solo', response)
      this.loadCampaignList();
    })
  }
}
