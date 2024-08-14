import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerModalComponent } from '../../components/customer-modal/customer-modal.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, CommonModule, CustomerModalComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {
  isModalOpen = false;
  isEditMode = false;

  customers = [
    { nombre: 'Cristobal Sosa', document: 1002479075, edad: 36, birthday: '10-10-1987', phone: '(+57) 3165121606', city: 'Bogotá' }
  ]

  showCreateModal() {
    this.isEditMode = false;
    this.isModalOpen = true;
  }

  showEditModal(campaign: any) {
    this.isEditMode = true;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onSubmit(){}

}
