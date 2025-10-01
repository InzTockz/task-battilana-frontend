import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { faTachometerAlt, faChalkboardTeacher, faArrowLeft, faUserGraduate, faBookOpen, faUserPlus, faFile,
  faDoorOpen, faHome
 } from '@fortawesome/free-solid-svg-icons'
import { SideNavItem } from '../../interfaces/side-nav.interface';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Roles } from '../../models/roles';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, FontAwesomeModule, RouterOutlet, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit{
  readonly faTachometerAlt = faTachometerAlt;
  readonly faChalkboardTeacher = faChalkboardTeacher;
  readonly faArrowLeft = faArrowLeft;
  readonly faUserGraduate = faUserGraduate;
  readonly faBookOpen = faBookOpen;
  readonly faFile = faFile;
  readonly faUserPlus = faUserPlus;
  readonly faDoorOpen = faDoorOpen;
  readonly home = faHome;

  public isLeftNavOpen = signal<boolean>(false);
  isButtonSelected:string = '1';

  homeUsers:SideNavItem = {icon: this.home, label: "Inicio", route: ''}
  fileUsers:SideNavItem = {icon: this.faFile, label: "Tareas por Usuario", route:"/manager-task"}
  navLogout:SideNavItem = {icon: this.faDoorOpen, label: "Cerrar sesion", route: '/logout'}

  constructor(private loginService:LoginService, private toastr:ToastrService, private router:Router
  ){}

  ngOnInit(){
  }

  isAdmin():boolean{
    const rol = this.loginService.getToken('userToken').rol;
    if(rol == 'ADMINISTRADOR'){
      return true;
    } else {
      return false;
    }
  }
  
  isButtonSiderSelected(value:string){
    this.isButtonSelected = value;
  }

  logoutUser(){
    this.loginService.logout()
    this.router.navigate(['/login'])
    this.toastr.success('', 'Cerraste sesion')
  }
  
}
