import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-banks',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent],
  templateUrl: './banks.component.html',
  styleUrl: './banks.component.css'
})
export class BanksComponent {

}
