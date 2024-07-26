import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-configurations',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent],
  templateUrl: './configurations.component.html',
  styleUrl: './configurations.component.css'
})
export class ConfigurationsComponent {

}
