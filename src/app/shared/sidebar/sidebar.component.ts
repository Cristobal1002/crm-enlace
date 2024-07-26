import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  isExpanded = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Verifica el estado inicial del submenú
    this.checkIfSubmenuShouldBeExpanded(this.router.url);

    // Suscríbete a los eventos de navegación
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkIfSubmenuShouldBeExpanded(event.urlAfterRedirects);
      }
    });
  }

  toggleMenu() {
    this.isExpanded = !this.isExpanded;
  }

  private checkIfSubmenuShouldBeExpanded(url: string): void {
    // Expande el submenú si la ruta actual es una de las rutas hijas de administración
    this.isExpanded = url.startsWith('/administracion');
  }

}
