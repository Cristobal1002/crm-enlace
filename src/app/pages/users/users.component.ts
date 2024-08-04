import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, FormsModule, CommonModule ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  users = [
    {nombre: 'Cristobal Sosa', document:1002479075, email:'cristobal1002@gmail.com', phone: '(+57) 3165121606', perfil:'administrador', status:'active'}
  ]
}
