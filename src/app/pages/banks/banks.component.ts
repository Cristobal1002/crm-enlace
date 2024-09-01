import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BankModalComponent } from '../../components/bank-modal/bank-modal.component';
import { GlobalLoadingComponent } from '../../components/global-loading/global-loading.component';
import { StatusLabelPipe } from '../../pipes/status-label.pipe';
import { BankService } from '../../services/bank.service';
import { LoadingService } from '../../services/loading.service';
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
  loadingCount = 0;
  banks: any[] = [];

  searchCriteria: string = '';
  searchValue: string = '';
  isEditMode = false
  isModalOpen= false
  selectedBank: any = null
  page = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;
  

  constructor(private bankService: BankService, private loadingService: LoadingService){}

  ngOnInit() {
    this.loadingService.show();
    this.loadBankList();
  }

  closeModal() {
    this.isModalOpen = false;
    this.loadBankList()
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
  let search: any
  this.loadingCount++
  if (!this.searchCriteria){
    search = null
  }else{ search = {[this.searchCriteria]: this.searchValue} }
   this.bankService.getBankListPag(this.page, this.pageSize, search )
    .subscribe((response: any) => {
      console.log('response en load',response)
      this.banks = response.data.items;
      this.totalItems = response.data.totalItems;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      this.loadingCount--;
      if (this.loadingCount === 0) this.loadingService.hide();
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
