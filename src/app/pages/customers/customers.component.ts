import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, CommonModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {

customers = [
  {nombre: 'Cristobal Sosa', document:1002479075, edad: 36, birthday: '10-10-1987', phone: '(+57) 3165121606', city:'Bogotá'}
]

}
