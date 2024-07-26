import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-donations',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent],
  templateUrl: './donations.component.html',
  styleUrl: './donations.component.css'
})
export class DonationsComponent {

}
