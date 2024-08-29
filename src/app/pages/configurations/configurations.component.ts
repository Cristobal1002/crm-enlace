import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StatusLabelPipe } from '../../pipes/status-label.pipe';
import { AuthServiceService } from '../../services/auth-service.service';
import { ReasonsNoveltiesService } from '../../services/reasons-novelties.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import Swal from 'sweetalert2';

interface Motivo {
  name: string;
  status: boolean;
  editando: boolean;
  esNuevo:boolean
}

@Component({
  selector: 'app-configurations',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, CommonModule, FormsModule, StatusLabelPipe],
  templateUrl: './configurations.component.html',
  styleUrl: './configurations.component.css'
})
export class ConfigurationsComponent {

  reasons: any[] = [];
  originalReasons: any[] =[ ];
  novelties: any[] = [];
  originalNovelties: any[] =[ ];

  page = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  pageNovelty = 1;
  pageSizeNovelty = 10;
  totalItemsNovelty = 0;
  totalPagesNovelty = 0;
  isLoading = false;
  currentUser: any;


  constructor(private authService: AuthServiceService, private reasonNoveltyService: ReasonsNoveltiesService){
    this.currentUser = authService.getUserData()
    this.loadReasonList()
    this.loadNoveltyList()
  }

  async loadReasonList() {
     this.reasonNoveltyService.getReasonListPag(this.page, this.pageSize)
      .subscribe((response: any) => {
        console.log('response en load',response)
        this.reasons = response.data.items;
        this.totalItems = response.data.totalItems;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      });
  }

  async loadNoveltyList() {
    this.reasonNoveltyService.getNoveltyListPag(this.pageNovelty, this.pageSizeNovelty)
     .subscribe((response: any) => {
       console.log('response en load de novelty',response)
       this.novelties = response.data.items;
       this.totalItemsNovelty = response.data.totalItems;
       this.totalPagesNovelty = Math.ceil(this.totalItemsNovelty / this.pageSizeNovelty);
     });
 }

  saveReason(index: number) {
    const reason = this.reasons[index];
    
    if (reason.esNuevo) {
      this.reasonNoveltyService.createReason({
        name: reason.name,
        status: reason.status,
        created_by: this.currentUser.user,
        updated_by: this.currentUser.user
      }).subscribe({
        next: response => {
          Swal.fire('Éxito', 'Motivo creado correctamente', 'success');
          // Actualiza el motivo con la respuesta del backend
          const createdReason = response.data; // Ajusta según la estructura de tu respuesta
          this.reasons[index] = createdReason;
          this.reasons[index].editando = false;
          this.reasons[index].esNuevo = false;
          this.originalReasons[index] = { ...this.reasons[index] }; // Actualiza la copia original
        },
        error: err => {
          Swal.fire('Error', 'Hubo un problema al crear el motivo', 'error');
        }
      });
    } else {
      // Si es un motivo existente, actualiza los datos
      this.reasonNoveltyService.updateReason(reason.id, {
        name: reason.name,
        status: reason.status,
        updated_by: this.currentUser.user
      }).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Motivo actualizado correctamente', 'success');
          // Desactiva el modo de edición
          reason.editando = false;
          this.originalReasons[index] = { ...this.reasons[index] };
          this.loadReasonList() // Actualiza la copia original
        },
        error: err => {
          Swal.fire('Error', 'Hubo un problema al actualizar el motivo', 'error');
        }
      });
    }
  }
  
  saveNovelty(index: number) {
    const novelty = this.novelties[index];
    
    if (novelty.esNuevo) {
      this.reasonNoveltyService.createNovelty({
        name: novelty.name,
        status: novelty.status,
        created_by: this.currentUser.user,
        updated_by: this.currentUser.user
      }).subscribe({
        next: response => {
          Swal.fire('Éxito', 'Novedad creada correctamente', 'success');
          // Actualiza el motivo con la respuesta del backend
          const createdNovelty = response.data; // Ajusta según la estructura de tu respuesta
          this.novelties[index] = createdNovelty;
          this.novelties[index].editando = false;
          this.novelties[index].esNuevo = false;
          this.originalNovelties[index] = { ...this.novelties[index] }; // Actualiza la copia original
        },
        error: err => {
          Swal.fire('Error', 'Hubo un problema al crear la novedad', 'error');
        }
      });
    } else {
      // Si es un motivo existente, actualiza los datos
      this.reasonNoveltyService.updateNovelty(novelty.id, {
        name: novelty.name,
        status: novelty.status,
        updated_by: this.currentUser.user
      }).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Motivo actualizado correctamente', 'success');
          // Desactiva el modo de edición
          novelty.editando = false;
          this.originalNovelties[index] = { ...this.novelties[index] }; // Actualiza la copia original
        },
        error: err => {
          Swal.fire('Error', 'Hubo un problema al actualizar el motivo', 'error');
        }
      });
    }
  }

  // Método para agregar un nuevo motivo
addReason() {
  const nuevoMotivo = { name: '', status: true, editando: true, esNuevo: true };
  this.reasons.unshift(nuevoMotivo);
}

  // Método para agregar un nuevo motivo
  addNovelty() {
    const nuevaNovedad = { name: '', status: true, editando: true, esNuevo: true };
    this.novelties.unshift(nuevaNovedad);
  }

// Método para cancelar la edición o creación de un motivo
cancelReason(index: number) {
  if (this.reasons[index].esNuevo) {
    // Elimina el motivo nuevo de la lista
    this.reasons.splice(index, 1);
  } else {
    // Restaura el motivo original y desactiva el modo de edición
    this.reasons[index] = { ...this.originalReasons[index] };
    this.reasons[index].editando = false;
  }
}

cancelNovelty(index: number) {
  if (this.novelties[index].esNuevo) {
    // Elimina el motivo nuevo de la lista
    this.novelties.splice(index, 1);
  } else {
    // Restaura el motivo original y desactiva el modo de edición
    this.novelties[index] = { ...this.originalNovelties[index] };
    this.novelties[index].editando = false;
  }
}


  editReason(index: number) {
    // Guarda una copia del motivo original antes de editar
    this.originalReasons[index] = { ...this.reasons[index] };
    this.reasons[index].editando = true;
  }


  editNovelty(index: number) {
    // Guarda una copia del motivo original antes de editar
    this.originalNovelties[index] = { ...this.novelties[index] };
    this.novelties[index].editando = true;
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.loadReasonList();
    }
  }

  changeNoveltyPage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPagesNovelty) {
      this.pageNovelty = newPage;
      this.loadNoveltyList();
    }
  }


}
