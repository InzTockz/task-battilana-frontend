import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { faTachometerAlt, faChalkboardTeacher, faArrowLeft, faUserGraduate, faBookOpen, faUserPlus, faFile,
  faDoorOpen
 } from '@fortawesome/free-solid-svg-icons'
import { SideNavItem } from '../../interfaces/side-nav.interface';
import { Router, RouterOutlet } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, FontAwesomeModule, RouterOutlet],
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

  isLeftNavOpen = signal<boolean>(true);

  navItems: SideNavItem[] = [
    {
      icon: this.faTachometerAlt,
      label: 'Dashboard',
      route: '/dashboard',
      isActive: true
    },
    {
      icon: this.faFile,
      label: 'Tareas por Usuario',
      route: '/courses',
      isActive: false
    },
    {
      icon: this.faUserPlus,
      label: 'Registrar Usuario',
      route: '/students',
      isActive: false
    }
  ]

  navLogout:SideNavItem = {icon: this.faDoorOpen, label: "Cerrar sesion", route: '/logout'}

  constructor(private loginService:LoginService, private toastr:ToastrService, private router:Router){}

  ngOnInit(){

  }
  
  handleActiveRoute(item: SideNavItem, index: number): void {
    this.navItems.map((navItem, i) => {
      navItem.isActive = i === index;
    });
  }

  logoutUser(){
    this.loginService.logout()
    this.router.navigate(['/login'])
    this.toastr.success('', 'Cerraste sesion')
  }
  
}
