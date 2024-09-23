import { Component } from '@angular/core';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { PodiumService } from '../../services/podium.service';
import { ReportsService } from '../../services/reports.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import Swal from 'sweetalert2';
import { LoadingService } from '../../services/loading.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, SelectDropDownModule, CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  
  selectedCampaign: any = {}
  donations: any[] =[]
  loadingCount=0
  campaigns: any[] = []
  dropDownConfig = {
    displayFn: (item: any) => `${item.name}`, // Key to display in the dropdown
    search: true, // Enable search
    height: '200px', // Set a fixed height for the dropdown list
    placeholder: 'Selección de campaña', // Placeholder text
    searchPlaceholder: 'Buscar', // Placeholder text for the search input
    noResultsFound: 'No results found!', // Text to display when no results are found
    searchOnKey: 'name' // Key to perform the search on
  };

  constructor(private podiumService: PodiumService, private reportsService: ReportsService,
    private loadingService: LoadingService){

  }
   ngOnInit(){
    this.loadingService.show();
    this.getCampaigns()
   }

   getCampaigns(){
    this.loadingCount++
    try {
      this.podiumService.getCampaignList().subscribe(response => {
        console.log('Respuesta de campañas',response.data)
        this.campaigns = response.data.items
        this.loadingCount--
        if (this.loadingCount === 0) this.loadingService.hide();
      })
    } catch (error) {
      console.error('Error in get campaigns', error);
    }

   }

   onSelectCampaign(selectedCampign: any){
    this.selectedCampaign = selectedCampign.value
    console.log('Campana seleccionada:', this.selectedCampaign)
   }

   getDonationByCampaign(){
    this.loadingService.show();
    const id = this.selectedCampaign.id
    if(!id){
      this.loadingService.hide()
       // Mostrar mensaje de error genérico
       Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Debe seleccionar una campaña',
        confirmButtonText: 'Aceptar'
      });
    }else{
      this.reportsService.getDonationsByCampaign(id).subscribe(response => {
        console.log('Respuesta del reporte', response.data)
        this.donations = response.data
        this.loadingService.hide()
      })
    }
   }

   downloadReport() {
    this.loadingService.show();
    const id = this.selectedCampaign?.id;
  
    if (!id) {
      this.loadingService.hide();
      // Mostrar mensaje de error genérico
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Debe seleccionar una campaña',
        confirmButtonText: 'Aceptar'
      });
    } else {
      this.reportsService.exportDonationsByCampaign(id).subscribe(
        async (response: Blob) => {
          const blob = new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });
  
          // Importación dinámica de file-saver
          const { saveAs } = await import('file-saver');
          saveAs(blob, 'donations_report.xlsx');
  
          this.loadingService.hide();
        },
        (error) => {
          console.error('Error al descargar el reporte:', error);
          this.loadingService.hide(); // Asegúrate de esconder el loading incluso en caso de error
  
          // Mostrar mensaje de error
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Hubo un problema al generar el reporte',
            confirmButtonText: 'Aceptar'
          });
        }
      );
    }
  }
  

}
