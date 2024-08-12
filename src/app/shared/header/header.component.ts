import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, NavigationEnd, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { Menu, MenuItem } from '../../interfaces/menu';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule, HttpClientModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  menuItems: MenuItem[] = [];
  isExpandedAdmin = false;
  isExpandedDonations = false;
  userRole: any; 
  user: any;
  asideMenu = false

  constructor(private http: HttpClient, private router: Router, private authService: AuthServiceService) {}

  ngOnInit(): void {
    this.loadMenu();
    this.checkIfSubmenuShouldBeExpanded(this.router.url);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkIfSubmenuShouldBeExpanded(event.urlAfterRedirects);
      }
    });
    this.user = this.authService.getUserData()
    this.userRole = this.user.role
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

  toggleAdminMenu() {
    this.isExpandedAdmin = !this.isExpandedAdmin;
  }

  toggleDonationsMenu() {
    this.isExpandedDonations = !this.isExpandedDonations;
  }

  private checkIfSubmenuShouldBeExpanded(url: string): void {
    this.isExpandedAdmin = url.startsWith('/administracion');
    this.isExpandedDonations = url.startsWith('/donaciones');
  }

  setAside(){
    !this.asideMenu
  }

  logout(){
    this.authService.logout()
  }

}
