import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, NavigationEnd, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Menu, MenuItem } from '../../interfaces/menu';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule, HttpClientModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  menuItems: MenuItem[] = [];
  isExpanded = false;
  userRole: string = 'admin'; // Cambia esto según el rol del usuario

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadMenu();
    this.checkIfSubmenuShouldBeExpanded(this.router.url);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkIfSubmenuShouldBeExpanded(event.urlAfterRedirects);
      }
    });
  }

  loadMenu() {
    this.http.get<Menu>('/assets/menu.json').subscribe(data => {
      this.menuItems = this.filterMenuByRole(data.menu);
    });
  }

  filterMenuByRole(menu: MenuItem[]): MenuItem[] {
    return menu.filter(item => item.roles.includes(this.userRole)).map(item => {
      if (item.submenu) {
        item.submenu = this.filterMenuByRole(item.submenu);
      }
      return item;
    });
  }

  toggleMenu() {
    this.isExpanded = !this.isExpanded;
  }

  private checkIfSubmenuShouldBeExpanded(url: string): void {
    this.isExpanded = url.startsWith('/administracion');
  }
}
