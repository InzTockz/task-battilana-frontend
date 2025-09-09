import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RegisterAdminComponent } from './components/admin/register-admin/register-admin.component';
import { TaskComponent } from './components/tasks/task/task.component';
import { TaskUserComponent } from './components/tasks/task-user/task-user.component';
import { FileTaskComponent } from './components/tasks/file-task/file-task.component';
import { Home } from 'lucide-angular';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [

    { path: 'login', component: LoginComponent },
    //{ path: 'register', component: RegisterComponent},
    {
        path: '',
        component: SidebarComponent,
        canActivate:[authGuard],
        children: [
            { 
                path: '', 
                component:  HomeComponent, 
                canActivate:[authGuard],
                children: [
                    {path: '', component: FileTaskComponent}
                ]
            },
            { path: 'manager-task', component: TaskUserComponent, canActivate:[authGuard]},
            { path: 'register-admin', component: RegisterAdminComponent, canActivate:[authGuard]}
        ]
    },
    {
        path: "**",
        canActivate: [authGuard],
        redirectTo: ''
    }
];
