import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [

    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent},
    {
        path: '',
        component: SidebarComponent,
        canActivate:[authGuard],
        children: [
            { path: '', component:  HomeComponent, canActivate:[authGuard]}
        ]
    },
    {
        path: "**",
        canActivate: [authGuard],
        redirectTo: ''
    }
];
