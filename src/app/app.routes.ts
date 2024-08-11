import { Routes, RouterModule } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';
import { BanksComponent } from './pages/banks/banks.component';
import { ConfigurationsComponent } from './pages/configurations/configurations.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DonationsComponent } from './pages/donations/donations.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { PodiumComponent } from './pages/podium/podium.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { UsersComponent } from './pages/users/users.component';

export const routes: Routes = [
    {path: 'dashboard', component:DashboardComponent, children:[
        {path: 'home', component: HomeComponent}
    ]
},
    { path: '', component: LoginComponent},
    { path: 'home', component: HomeComponent, canActivate:[authGuard] },
    { path: 'podium', component: PodiumComponent,canActivate:[authGuard, adminGuard] },
    {
        path: 'donaciones', canActivate:[authGuard],children: [
            { path: 'donantes',canActivate:[authGuard], component: CustomersComponent },
            { path: 'manage',canActivate:[authGuard], component: DonationsComponent },
        ]
    },

    { path: 'reportes', component: ReportsComponent,canActivate:[authGuard] },
    {
        path: 'administracion', canActivate:[authGuard, adminGuard], children: [
            { path: 'usuarios', canActivate:[authGuard, adminGuard], component: UsersComponent },
            { path: 'bancos',canActivate:[authGuard, adminGuard], component: BanksComponent },
            { path: 'configuraciones',canActivate:[authGuard, adminGuard], component: ConfigurationsComponent }
        ]
    },
    { path: '', redirectTo: '/home', pathMatch: 'full' }
];
