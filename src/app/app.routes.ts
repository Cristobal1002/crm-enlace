import { Routes, RouterModule } from '@angular/router';
import { BanksComponent } from './pages/banks/banks.component';
import { ConfigurationsComponent } from './pages/configurations/configurations.component';
import { DonationsComponent } from './pages/donations/donations.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { PodiumComponent } from './pages/podium/podium.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { UsersComponent } from './pages/users/users.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'podium', component: PodiumComponent },
    { path: 'donaciones', component: DonationsComponent },
    { path: 'reportes', component: ReportsComponent },
    {
        path: 'administracion', children: [
            { path: 'usuarios', component: UsersComponent },
            { path: 'bancos', component: BanksComponent },
            { path: 'configuraciones', component: ConfigurationsComponent }
        ]
    },
    { path: '', redirectTo: '/home', pathMatch: 'full' }
];
