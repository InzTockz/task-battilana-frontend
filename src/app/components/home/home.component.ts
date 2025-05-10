import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartColumn, CircleCheck, Clock, FileIcon, LucideAngularModule, PanelLeft, Plus, Search, User} from 'lucide-angular';
import { TareasService } from '../../services/tareas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TareaRequest } from '../../models/tareas/tarea-request';
import { TareaResponse } from '../../models/tareas/tarea-response';
import { UsuariosService } from '../../services/usuarios.service';
import { UsuariosResponse } from '../../models/usuarios/usuarios-response';

import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LucideAngularModule, CommonModule, FormsModule, CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements OnInit{

  readonly icons = { fileIcon: FileIcon, panelLeft: PanelLeft, plus: Plus, clock:Clock, circleCheck:CircleCheck,
    stadistic:ChartColumn, search:Search
  }

  @ViewChild('modalRegistro') modalRegistro!: ElementRef<HTMLDialogElement>;

  tareas:TareaResponse[] = [];
  usuarios:UsuariosResponse[] = [];
  contadorPendiente!:number;
  contadorTerminado!:number;
  tarea:TareaRequest = new TareaRequest;
  fechaInicio:string = "";
  fechaFin:string = "";

  constructor(private tareasService:TareasService, private usuariosService:UsuariosService){}

  ngOnInit(): void {
    this.listarTareas();
    this.tareasService.getContadorPendiente().subscribe(response => this.contadorPendiente = response);
    this.tareasService.getContadorTerminado().subscribe(response => this.contadorTerminado = response);
    this.usuariosService.getUsuarios().subscribe(response => this.usuarios = response);
  }

  listarTareas():void{
    this.tareasService.getTareas().subscribe(response => this.tareas = response)
  }

  registrarTarea():void{
    this.tareasService.postTareas(this.tarea).subscribe(
      () => {
        this.listarTareas()
        this.modalRegistro.nativeElement.close();
        this.tarea = new TareaRequest();
      }
    )
  }

  closeModal(){
    this.modalRegistro.nativeElement.close();
    this.tarea = new TareaRequest();
  }
}
