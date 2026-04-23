import { Component, OnInit, signal, HostListener } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { faTachometerAlt, faChalkboardTeacher, faArrowLeft, faUserGraduate, faBookOpen, faUserPlus, faFile,
  faDoorOpen, faHome, faListCheck, faUserTie, faUsersLine, faBars, faXmark
 } from '@fortawesome/free-solid-svg-icons'
import { SideNavItem } from '../../interfaces/side-nav.interface';
import { NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';

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
  readonly listCheck = faListCheck
  readonly faUsersLine = faUsersLine
  readonly faBars = faBars
  readonly faXmark = faXmark

  // Sidebar expandido en desktop (mostrar labels)
  public isLeftNavOpen = signal<boolean>(true);
  // Drawer abierto en mobile
  public isMobileOpen = signal<boolean>(false);
  // Detección mobile vs desktop
  public isMobile = signal<boolean>(false);

  isButtonSelected: string = '1';

  homeUsers:SideNavItem = {icon: this.home, label: "Inicio", route: ''}
  fileUsers:SideNavItem = {icon: this.listCheck, label: "Tareas por Usuario", route:"/manager-task"}
  userManager:SideNavItem = {icon: this.faUsersLine, label: "Usuarios", route: "/register-admin"}
  navLogout:SideNavItem = {icon: this.faDoorOpen, label: "Cerrar sesion", route: '/logout'}

  constructor(private loginService:LoginService, private toastr:ToastrService, private router:Router
  ){}

  ngOnInit(){
    this.checkViewport();
    // Cerrar drawer al navegar
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      if (this.isMobile()) this.isMobileOpen.set(false);
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.checkViewport();
  }

  private checkViewport() {
    const mobile = window.innerWidth < 1024;
    this.isMobile.set(mobile);
    if (!mobile) this.isMobileOpen.set(false);
  }

  toggleSidebar() {
    if (this.isMobile()) {
      this.isMobileOpen.update(v => !v);
    } else {
      this.isLeftNavOpen.update(v => !v);
    }
  }

  openMobile() {
    this.isMobileOpen.set(true);
  }

  closeMobile() {
    this.isMobileOpen.set(false);
  }

  isAdmin():boolean{
    const rol = this.loginService.getToken('userToken')?.rol;
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
    this.toastr.error('', 'Sesión finalizada')
  }
}
