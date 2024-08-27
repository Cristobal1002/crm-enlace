import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserModalComponent } from '../../components/user-modal/user-modal.component';
import { StatusLabelPipe } from '../../pipes/status-label.pipe';
import { AuthServiceService } from '../../services/auth-service.service';
import { UserService } from '../../services/user.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, FormsModule, CommonModule, ReactiveFormsModule, UserModalComponent , StatusLabelPipe ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {

  users: any[] = [];
  searchCriteria: string = '';
  searchValue: string = '';
  isEditMode = false
  isModalOpen= false
  selectedUser: any = null
  page = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;


  constructor(private userService:UserService){
    this.loadUserList()
  }

  closeModal() {
    this.loadUserList()
    this.isModalOpen = false;
  }

  showCreateModal() {
    this.isEditMode = false;
    this.isModalOpen = true;
  }

  showEditModal(user: any) {
    this.isEditMode = true;
    this.selectedUser = user
    this.isModalOpen = true;
}

loadUserList() {
  console.log('entra a load Users')
  let search: any
  if (!this.searchCriteria){
    search = null
  }else{ search = {[this.searchCriteria]: this.searchValue} }
  console.log('Search:', search)
   this.userService.getUserListPag(this.page, this.pageSize, search )
    .subscribe((response: any) => {
      console.log('response en load',response)
      this.users = response.data.users;
      this.totalItems = response.data.totalItems;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    });
}

onSearchCriteriaChange() {
  this.loadUserList();
}

onSearchValueChange() {
  this.loadUserList();
}

changePage(newPage: number) {
  if (newPage >= 1 && newPage <= this.totalPages) {
    this.page = newPage;
    this.loadUserList();
  }
}

}
