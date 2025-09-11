import { Component, OnInit } from '@angular/core';
import { TareasService } from '../../services/tareas.service';
import { LoginService } from '../../services/login.service';
import { LucideAngularModule, FileIcon, PanelLeft, Plus, Clock, ChartColumn, Search, CircleCheck, Check, Trash2 } from 'lucide-angular';
import { RouterOutlet } from '@angular/router';
import { TareaRequest } from '../../models/tareas/tarea-request';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, LucideAngularModule, FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  readonly icons = {
      fileIcon: FileIcon, panelLeft: PanelLeft, plus: Plus, clock: Clock, circleCheck: CircleCheck,
      stadistic: ChartColumn, search: Search, trash: Trash2
    }

  contadorPendiente!: number;
  contadorTerminado!: number;
  contadorTotales!: number;
  tarea:TareaRequest = new TareaRequest();

  constructor(private tareasService: TareasService, private loginService: LoginService) { }

  ngOnInit(): void {
    this.listarContadorCompletadoPorUsuario();
    this.listarContadorPendientePorUsuario();
    this.listarContadorTotalPorUsuario();
  }

  listarContadorPendientePorUsuario(): void {
    const idUsuario = this.loginService.getToken('userToken').idUsuarios;
    this.tareasService.getContadorPendientePorUsuario(Number(idUsuario)).subscribe(
      pendiente => this.contadorPendiente = pendiente
    )
  }

  listarContadorCompletadoPorUsuario(): void {
    const idUsuario = this.loginService.getToken('userToken').idUsuarios;
    this.tareasService.getContadorCompletadoPorUsuario(Number(idUsuario)).subscribe(
      completado => this.contadorTerminado = completado
    )
  }

  listarContadorTotalPorUsuario(): void {
    const idUsuario = this.loginService.getToken('userToken').idUsuarios;
    this.tareasService.getContadorTotalPorUsuario(Number(idUsuario)).subscribe(
      total => this.contadorTotales = total
    )
  }

  addTask():void{

  }

  closeModal():void{

  }
}
