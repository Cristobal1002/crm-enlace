import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerModalComponent } from '../../components/customer-modal/customer-modal.component';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { CustomerService } from '../../services/customer.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, CommonModule, CustomerModalComponent, FormsModule, ReactiveFormsModule, DateFormatPipe],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {
  customers: any[] = [];

  searchCriteria: string = '';
  searchValue: string = '';

  selectedCustomer: any = null;
  isModalOpen = false;
  isEditMode = false;
  page = 1;
  pageSize = 5;
  totalItems = 0;
  totalPages = 0;


  constructor(private customerService: CustomerService) {
    this.loadCustomerList()
  }


  //getters
  getCustomerName(customer: any): string {
    return customer.first_name && customer.last_name
      ? `${customer.first_name} ${customer.last_name}`
      : customer.company_name || 'Nombre no disponible';
  }

  showCreateModal() {
    this.isEditMode = false;
    this.isModalOpen = true;
  }

  showEditModal(customer: any) {
    this.isEditMode = true;
    this.selectedCustomer = customer; // Asegúrate que este 'customer' tenga datos
    console.log('Customer seleccionado:', this.selectedCustomer);
    this.isModalOpen = true;
}

  closeModal() {
    console.log('Entra a close modal')
    
    this.isModalOpen = false;
    this.loadCustomerList()
  }


  loadCustomerList() {
  
    let search: any
    if (!this.searchCriteria){
      search = null
    }else{ search = {[this.searchCriteria]: this.searchValue} || null }
    console.log('Search:', search)
    this.customerService.getCustomerListPag(this.page, this.pageSize, search )
      .subscribe((response: any) => {
        console.log('response en load', response)
        this.customers = response.data.items;
        this.totalItems = response.data.totalItems;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      });
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.loadCustomerList();
    }
  }

  // Método para calcular la edad
  calculateAge(birthDate: string | null): string {
    if (!birthDate) {
      return 'N/A';
    }

    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();

    // Ajustar la edad si el cumpleaños aún no ha pasado este año
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }

    return age.toString();
  }

  onSearchCriteriaChange() {
    this.loadCustomerList();
  }

  onSearchValueChange() {
    this.loadCustomerList();
  }

}
