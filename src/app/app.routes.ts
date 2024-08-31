import { Routes, RouterModule } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';
import { BanksComponent } from './pages/banks/banks.component';
import { ConfigurationsComponent } from './pages/configurations/configurations.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { DonationsComponent } from './pages/donations/donations.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { PagesComponent } from './pages/pages/pages.component';
import { PodiumComponent } from './pages/podium/podium.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { UsersComponent } from './pages/users/users.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: '', canActivate: [authGuard], component: PagesComponent, children: [
            { path: 'home', component: HomeComponent, canActivate: [authGuard] },
            { path: 'podium', component: PodiumComponent, canActivate: [authGuard, adminGuard] },
            {
                path: 'donaciones', canActivate: [authGuard], children: [
                    { path: 'donantes', component: CustomersComponent },
                    { path: 'manage', component: DonationsComponent },
                    { path: 'manage/:document', component: DonationsComponent },
                ]
            },
            { path: 'reportes', component: ReportsComponent, canActivate: [authGuard] },
            {
                path: 'administracion', canActivate: [authGuard, adminGuard], children: [
                    { path: 'usuarios', component: UsersComponent },
                    { path: 'bancos', component: BanksComponent },
                    { path: 'configuraciones', component: ConfigurationsComponent }
                ]
            },
        ]
    },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/login', pathMatch: 'full' }
];
