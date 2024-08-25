import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BankModalComponent } from '../../components/bank-modal/bank-modal.component';
import { StatusLabelPipe } from '../../pipes/status-label.pipe';
import { BankService } from '../../services/bank.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-banks',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, CommonModule, FormsModule, BankModalComponent, StatusLabelPipe],
  templateUrl: './banks.component.html',
  styleUrl: './banks.component.css'
})
export class BanksComponent {
  banks: any[] = [];

  searchCriteria: string = '';
  searchValue: string = '';
  isEditMode = false
  isModalOpen= false
  selectedBank: any = null
  page = 1;
  pageSize = 5;
  totalItems = 0;
  totalPages = 0;
  

  constructor(private bankService: BankService){
    this.loadBankList();
  }

  closeModal() {
    this.loadBankList()
    this.isModalOpen = false;
  }

  showCreateModal() {
    this.isEditMode = false;
    this.isModalOpen = true;
  }

  showEditModal(bank: any) {
    this.isEditMode = true;
    this.selectedBank = bank
    this.isModalOpen = true;
}

loadBankList() {
  console.log('entra a load banks')
  let search: any
  if (!this.searchCriteria){
    search = null
  }else{ search = {[this.searchCriteria]: this.searchValue} }
  console.log('Search:', search)
   this.bankService.getBankListPag(this.page, this.pageSize, search )
    .subscribe((response: any) => {
      console.log('response en load',response)
      this.banks = response.data.items;
      this.totalItems = response.data.totalItems;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    });
}

onSearchCriteriaChange() {
  this.loadBankList();
}

onSearchValueChange() {
  this.loadBankList();
}
changePage(newPage: number) {
  if (newPage >= 1 && newPage <= this.totalPages) {
    this.page = newPage;
    this.loadBankList();
  }
}

}
