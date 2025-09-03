import { Component, signal } from '@angular/core';
import { RouterOutlet } from "../../../../node_modules/@angular/router/router_module.d-BivBj8FC";
import { HomeComponent } from "../home/home.component";
import { CommonModule, NgClass} from '@angular/common';
import { FontAwesomeModule} from '@fortawesome/angular-fontawesome'
import {faTachometerAlt, faChalkboardTeacher, faArrowLeft} from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  readonly faTachometerAlt = faTachometerAlt;
  readonly faChalkboardTeacher = faChalkboardTeacher;
  readonly faArrowLeft = faArrowLeft;
  
  isLeftNavOpen = signal<boolean>(true);
}
