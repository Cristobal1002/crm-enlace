export interface MenuItem {
    label: string;
    icon?: string;
    routerLink: string;
    roles: string[];
    submenu?: MenuItem[];
  }
  
  export interface Menu {
    menu: MenuItem[];
  }