import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-podium',
  standalone: true,
  imports: [HeaderComponent,SidebarComponent, RouterLink, RouterOutlet],
  templateUrl: './podium.component.html',
  styleUrl: './podium.component.css'
})
export class PodiumComponent {

}
